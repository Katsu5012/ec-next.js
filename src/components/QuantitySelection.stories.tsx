import type { Meta, StoryObj } from '@storybook/react';
import { Provider as UrqlProvider } from 'urql';
import { QuantitySelection } from './QuantitySelection';
import { mockProducts } from '../data/products';
import { useEffect } from 'react';
import { useSelectedProduct } from '../hooks/useSelectedProduct';
import { useCart } from '../hooks/useCart';
import { createUrqlClient } from '../lib/urql';

const urqlClient = createUrqlClient();

const meta = {
  title: 'Components/QuantitySelection',
  component: QuantitySelection,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: '/quantity',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <UrqlProvider value={urqlClient}>
        <Story />
      </UrqlProvider>
    ),
  ],
} satisfies Meta<typeof QuantitySelection>;

export default meta;
type Story = StoryObj<typeof meta>;
type StoryWithoutArgs = Omit<Story, 'args'>;

// ストーリー用のラッパーコンポーネント
const QuantitySelectionWrapper = ({
  productIndex = 0,
  cartQuantity = 0,
}: {
  productIndex?: number;
  cartQuantity?: number;
}) => {
  const { selectProduct } = useSelectedProduct();
  const { addToCart, clearCart } = useCart();

  useEffect(() => {
    clearCart();
    selectProduct(mockProducts[productIndex], 1);

    // カートに既存数量がある場合は追加
    if (cartQuantity > 0) {
      addToCart(mockProducts[productIndex], cartQuantity);
    }
  }, [productIndex, cartQuantity]);

  return (
    <QuantitySelection
      onComplete={() => alert('カートに追加されました')}
      onCancel={() => alert('キャンセルされました')}
    />
  );
};

export const Default: StoryWithoutArgs = {
  render: () => <QuantitySelectionWrapper />,
};

export const WithExistingCartItem: StoryWithoutArgs = {
  render: () => <QuantitySelectionWrapper productIndex={0} cartQuantity={3} />,
  parameters: {
    docs: {
      description: {
        story: '既にカートに3個入っている状態で、同じ商品をさらに追加する場合',
      },
    },
  },
};

export const WithLargeCartQuantity: StoryWithoutArgs = {
  render: () => <QuantitySelectionWrapper productIndex={0} cartQuantity={8} />,
  parameters: {
    docs: {
      description: {
        story: '既にカートに8個入っている状態',
      },
    },
  },
};

export const ExpensiveProduct: StoryWithoutArgs = {
  render: () => <QuantitySelectionWrapper productIndex={2} />,
};

export const ExpensiveProductWithCart: StoryWithoutArgs = {
  render: () => <QuantitySelectionWrapper productIndex={2} cartQuantity={2} />,
};

export const LowStockProduct: StoryWithoutArgs = {
  render: () => {
    const { selectProduct } = useSelectedProduct();
    const { clearCart } = useCart();

    useEffect(() => {
      clearCart();
      const product = { ...mockProducts[0], stock: 3 };
      selectProduct(product, 1);
    }, []);

    return (
      <QuantitySelection
        onComplete={() => alert('カートに追加されました')}
        onCancel={() => alert('キャンセルされました')}
      />
    );
  },
};

export const NoProductSelected: Story = {
  args: {
    onComplete: () => alert('完了'),
    onCancel: () => alert('キャンセル'),
  },
};
