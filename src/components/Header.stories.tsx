import type { Meta, StoryObj } from '@storybook/react';
import { Provider as UrqlProvider } from 'urql';
import { Header } from './Header';
import { useCart } from '../hooks/useCart';
import { mockProducts } from '../data/products';
import { useEffect } from 'react';
import { createUrqlClient } from '../lib/urql';

const urqlClient = createUrqlClient();

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: '/',
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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCartItems: Story = {
  render: () => {
    const { addToCart, clearCart } = useCart();

    useEffect(() => {
      clearCart();
      addToCart(mockProducts[0], 2);
      addToCart(mockProducts[1], 1);
    }, []);

    return <Header />;
  },
};

export const WithManyCartItems: Story = {
  render: () => {
    const { addToCart, clearCart } = useCart();

    useEffect(() => {
      clearCart();
      mockProducts.forEach((product, index) => {
        addToCart(product, index + 1);
      });
    }, []);

    return <Header />;
  },
};

export const WithOver99Items: Story = {
  render: () => {
    const { addToCart, clearCart } = useCart();

    useEffect(() => {
      clearCart();
      mockProducts.forEach((product) => {
        addToCart(product, 20);
      });
    }, []);

    return <Header />;
  },
};
