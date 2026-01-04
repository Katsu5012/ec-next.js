import type { Meta, StoryObj } from '@storybook/react';
import { Provider as UrqlProvider } from 'urql';
import { Cart } from './Cart';
import { mockProducts } from '../../data/products';
import { useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { createUrqlClient } from '../../lib/urql';

const urqlClient = createUrqlClient();

const meta = {
  title: 'Components/Cart',
  component: Cart,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: '/cart',
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
} satisfies Meta<typeof Cart>;

export default meta;
type Story = StoryObj<typeof meta>;

type StoryWithoutArgs = Omit<Story, 'args'>;

export const EmptyCart: Story = {
  args: {
    onContinueShopping: () => alert('買い物を続ける'),
  },
};

// カートに商品がある状態のラッパー
const CartWithItemsWrapper = ({ itemCount = 2 }: { itemCount?: number }) => {
  const { addToCart, clearCart } = useCart();

  useEffect(() => {
    clearCart();
    for (let i = 0; i < itemCount && i < mockProducts.length; i++) {
      addToCart(mockProducts[i], i + 1);
    }
  }, [itemCount]);

  return <Cart onContinueShopping={() => alert('買い物を続ける')} />;
};

export const WithItems: StoryWithoutArgs = {
  render: () => <CartWithItemsWrapper itemCount={3} />,
};

export const SingleItem: StoryWithoutArgs = {
  render: () => <CartWithItemsWrapper itemCount={1} />,
};

export const ManyItems: StoryWithoutArgs = {
  render: () => <CartWithItemsWrapper itemCount={6} />,
};

export const FullCart: StoryWithoutArgs = {
  render: () => {
    const { addToCart, clearCart } = useCart();

    useEffect(() => {
      clearCart();
      mockProducts.forEach((product, index) => {
        addToCart(product, (index % 3) + 1);
      });
    }, []);

    return <Cart onContinueShopping={() => alert('買い物を続ける')} />;
  },
};
