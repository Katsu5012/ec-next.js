import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard, ProductCardFragment } from './ProductCard';
import { mockProducts } from '@/data/products';
import { within, userEvent, expect } from '@storybook/test';
import type { FragmentType } from '@/gql';
import { makeFragmentData } from '@/gql';

const createMockProductCard = (
  product: (typeof mockProducts)[0]
): FragmentType<typeof ProductCardFragment> => {
  return makeFragmentData(
    {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    },
    ProductCardFragment
  );
};

const meta = {
  title: 'Product/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;
type StoryWithoutArgs = Omit<Story, 'args'>;

// ✅ デフォルト状態
export const Default: Story = {
  args: {
    data: createMockProductCard(mockProducts[0]),
  },
};

// ✅ 在庫切れ
export const OutOfStock: Story = {
  args: {
    data: createMockProductCard({
      ...mockProducts[0],
      stock: 0,
    }),
  },
};

// ✅ 在庫少ない
export const LowStock: Story = {
  args: {
    data: createMockProductCard({
      ...mockProducts[0],
      stock: 2,
    }),
  },
};

// ✅ 高額商品
export const Expensive: Story = {
  args: {
    data: createMockProductCard({
      ...mockProducts[0],
      price: 1298000,
    }),
  },
};

// ✅ カート内にある状態
export const InCart: Story = {
  args: {
    data: createMockProductCard(mockProducts[0]),
  },
  decorators: [
    (Story) => {
      // カートにデータをセット
      localStorage.setItem(
        'ec-cart-items',
        JSON.stringify([
          {
            product: mockProducts[0],
            quantity: 3,
            addedAt: Date.now(),
          },
        ])
      );
      return <Story />;
    },
  ],
};

// ✅ カート内に大量にある
export const InCartMany: Story = {
  args: {
    data: createMockProductCard(mockProducts[0]),
  },
  decorators: [
    (Story) => {
      localStorage.setItem(
        'ec-cart-items',
        JSON.stringify([
          {
            product: mockProducts[0],
            quantity: 15,
            addedAt: Date.now(),
          },
        ])
      );
      return <Story />;
    },
  ],
};

// ✅ 別の商品
export const SecondProduct: Story = {
  args: {
    data: createMockProductCard(mockProducts[1]),
  },
};

// ✅ 3番目の商品
export const ThirdProduct: Story = {
  args: {
    data: createMockProductCard(mockProducts[2]),
  },
};

// ✅ インタラクション: 購入ボタンクリック
export const PurchaseInteraction: Story = {
  args: {
    data: createMockProductCard(mockProducts[0]),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 購入ボタンを探す
    const purchaseButton = canvas.getByRole('button', { name: '購入数を選択' });

    // ボタンが有効であることを確認
    await expect(purchaseButton).toBeEnabled();

    // ボタンをクリック
    await userEvent.click(purchaseButton);

    // localStorageに保存されたことを確認
    const selectedProduct = localStorage.getItem('ec-selected-product');
    expect(selectedProduct).toBeTruthy();

    if (selectedProduct) {
      const parsed = JSON.parse(selectedProduct);
      expect(parsed.product.id).toBe(mockProducts[0].id);
      expect(parsed.quantity).toBe(1);
    }
  },
};

// ✅ インタラクション: 在庫切れ商品はクリックできない
export const OutOfStockInteraction: Story = {
  args: {
    data: createMockProductCard({
      ...mockProducts[0],
      stock: 0,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 在庫切れボタンを探す
    const button = canvas.getByRole('button', { name: '在庫切れ' });

    // ボタンが無効であることを確認
    await expect(button).toBeDisabled();

    // スタイルを確認
    expect(button).toHaveClass('bg-gray-300');
  },
};

// ✅ インタラクション: カートバッジの確認
export const CartBadgeInteraction: Story = {
  args: {
    data: createMockProductCard(mockProducts[0]),
  },
  decorators: [
    (Story) => {
      localStorage.setItem(
        'ec-cart-items',
        JSON.stringify([
          {
            product: mockProducts[0],
            quantity: 7,
            addedAt: Date.now(),
          },
        ])
      );
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // カートバッジを確認
    const badge = canvas.getByText('カート内: 7個');
    await expect(badge).toBeInTheDocument();

    // バッジのスタイルを確認
    expect(badge).toHaveClass('absolute');
    expect(badge).toHaveClass('bg-blue-600');
    expect(badge).toHaveClass('text-white');
  },
};

// ✅ すべての商品を一覧表示
export const AllProducts: StoryWithoutArgs = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      {mockProducts.map((product) => (
        <ProductCard key={product.id} data={createMockProductCard(product)} />
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// ✅ レスポンシブ確認用
export const Responsive: Story = {
  args: {
    data: createMockProductCard(mockProducts[0]),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
