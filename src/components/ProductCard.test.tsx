import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { ProductCard, ProductCardFragment } from './ProductCard';
import { mockProducts } from '@/data/products';
import userEvent from '@testing-library/user-event';
import * as router from 'next/router';
import type { NextRouter } from 'next/router';
import type { FragmentType } from '@/gql';
import { makeFragmentData } from '@/gql';

describe('ProductCard', () => {
  const mockPush = vi.fn();

  const createMockProductCard = (
    product = mockProducts[0]
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

  beforeEach(() => {
    mockPush.mockClear();
    localStorage.clear();

    vi.mocked(router.useRouter).mockReturnValue({
      push: mockPush,
      pathname: '/',
      route: '/',
      query: {},
      asPath: '/',
      basePath: '',
      isLocaleDomain: false,
      replace: vi.fn(),
      reload: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      beforePopState: vi.fn(),
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
      },
      isFallback: false,
      isReady: true,
      isPreview: false,
      locale: undefined,
      locales: undefined,
      defaultLocale: undefined,
      domainLocales: undefined,
    } as NextRouter);
  });

  describe('表示', () => {
    it('商品名が表示される', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      expect(
        screen.getByRole('heading', { name: mockProducts[0].name, level: 3 })
      ).toBeInTheDocument();
    });

    it('価格が正しく表示される', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      expect(screen.getByText(`¥${mockProducts[0].price.toLocaleString()}`)).toBeInTheDocument();
    });

    it('在庫数が表示される', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      expect(screen.getByText(`在庫: ${mockProducts[0].stock}個`)).toBeInTheDocument();
    });

    it('商品画像が表示される', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      const img = screen.getByAltText(mockProducts[0].name);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockProducts[0].imageUrl);
    });

    it('購入ボタンが表示される', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      expect(screen.getByRole('button', { name: '購入数を選択' })).toBeInTheDocument();
    });
  });

  describe('在庫状態', () => {
    it('在庫がある場合、購入ボタンが有効', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      const button = screen.getByRole('button', { name: '購入数を選択' });
      expect(button).not.toBeDisabled();
      expect(button).toHaveClass('bg-blue-600');
    });

    it('在庫切れの場合、ボタンが無効化される', () => {
      const outOfStock = { ...mockProducts[0], stock: 0 };
      const data = createMockProductCard(outOfStock);
      render(<ProductCard data={data} />);

      const button = screen.getByRole('button', { name: '在庫切れ' });
      expect(button).toBeDisabled();
      expect(button).toHaveClass('bg-gray-300');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    it('在庫数が0の場合、在庫表示が0個', () => {
      const outOfStock = { ...mockProducts[0], stock: 0 };
      const data = createMockProductCard(outOfStock);
      render(<ProductCard data={data} />);

      expect(screen.getByText('在庫: 0個')).toBeInTheDocument();
    });
  });

  describe('購入操作', () => {
    it('購入ボタンをクリックすると数量選択ページに遷移する', async () => {
      const user = userEvent.setup();
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      const button = screen.getByRole('button', { name: '購入数を選択' });
      await user.click(button);

      expect(mockPush).toHaveBeenCalledWith('/quantity');
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('購入ボタンをクリックすると商品がlocalStorageに保存される', async () => {
      const user = userEvent.setup();
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      const button = screen.getByRole('button', { name: '購入数を選択' });
      await user.click(button);

      const selectedProduct = localStorage.getItem('ec-selected-product');
      expect(selectedProduct).not.toBeNull();

      if (selectedProduct) {
        const parsed = JSON.parse(selectedProduct);
        expect(parsed.product.id).toBe(mockProducts[0].id);
        expect(parsed.product.name).toBe(mockProducts[0].name);
        expect(parsed.quantity).toBe(1);
      }
    });

    it('在庫切れの商品は購入ボタンをクリックできない', async () => {
      const user = userEvent.setup();
      const outOfStock = { ...mockProducts[0], stock: 0 };
      const data = createMockProductCard(outOfStock);
      render(<ProductCard data={data} />);

      const button = screen.getByRole('button', { name: '在庫切れ' });

      // クリックを試みる
      await user.click(button);

      // 遷移していないことを確認
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('カートバッジ', () => {
    it('カートに商品がない場合、バッジは表示されない', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      expect(screen.queryByText(/カート内:/)).not.toBeInTheDocument();
    });

    it('カートに商品がある場合、バッジが表示される', () => {
      const cartItems = [{ product: mockProducts[0], quantity: 3, addedAt: Date.now() }];
      localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));

      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      expect(screen.getByText('カート内: 3個')).toBeInTheDocument();
    });

    it('カートに複数個ある場合、正しい数量が表示される', () => {
      const cartItems = [{ product: mockProducts[0], quantity: 10, addedAt: Date.now() }];
      localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));

      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      expect(screen.getByText('カート内: 10個')).toBeInTheDocument();
    });

    it('他の商品がカートにある場合、バッジは表示されない', () => {
      const cartItems = [{ product: mockProducts[1], quantity: 5, addedAt: Date.now() }];
      localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));

      const data = createMockProductCard(mockProducts[0]);
      render(<ProductCard data={data} />);

      expect(screen.queryByText(/カート内:/)).not.toBeInTheDocument();
    });

    it('バッジが右上に配置される', () => {
      const cartItems = [{ product: mockProducts[0], quantity: 2, addedAt: Date.now() }];
      localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));

      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      const badge = screen.getByText('カート内: 2個');
      expect(badge).toHaveClass('absolute');
      expect(badge).toHaveClass('top-2');
      expect(badge).toHaveClass('right-2');
    });
  });

  describe('スタイリング', () => {
    it('カードに正しいスタイルが適用される', () => {
      const data = createMockProductCard();
      const { container } = render(<ProductCard data={data} />);

      const card = container.firstChild;
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-md');
    });

    it('画像が正しいサイズで表示される', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      const img = screen.getByAltText(mockProducts[0].name);
      expect(img).toHaveClass('w-full');
      expect(img).toHaveClass('h-48');
      expect(img).toHaveClass('object-cover');
    });

    it('購入ボタンに正しいスタイルが適用される', () => {
      const data = createMockProductCard();
      render(<ProductCard data={data} />);

      const button = screen.getByRole('button', { name: '購入数を選択' });
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('text-white');
    });
  });

  describe('異なる商品データ', () => {
    it('2番目の商品が正しく表示される', () => {
      const data = createMockProductCard(mockProducts[1]);
      render(<ProductCard data={data} />);

      expect(screen.getByRole('heading', { name: mockProducts[1].name })).toBeInTheDocument();
      expect(screen.getByText(`¥${mockProducts[1].price.toLocaleString()}`)).toBeInTheDocument();
    });

    it('高額商品の価格が正しくフォーマットされる', () => {
      const expensiveProduct = { ...mockProducts[0], price: 1234567 };
      const data = createMockProductCard(expensiveProduct);
      render(<ProductCard data={data} />);

      expect(screen.getByText('¥1,234,567')).toBeInTheDocument();
    });
  });
});
