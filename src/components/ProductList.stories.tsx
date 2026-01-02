import type { Meta, StoryObj } from '@storybook/react';
import { Provider as UrqlProvider } from 'urql';
import { ProductList } from './ProductList';
import { mockProducts } from '../data/products';
import { createUrqlClient } from '../lib/urql';

const urqlClient = createUrqlClient();

const meta = {
  title: 'Components/ProductList',
  component: ProductList,
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
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    products: mockProducts,
  },
};

export const EmptyList: Story = {
  args: {
    products: [],
  },
};

export const SingleProduct: Story = {
  args: {
    products: [mockProducts[0]],
  },
};

export const OutOfStock: Story = {
  args: {
    products: mockProducts.map((p) => ({ ...p, stock: 0 })),
  },
};

export const LimitedStock: Story = {
  args: {
    products: mockProducts.map((p) => ({ ...p, stock: 2 })),
  },
};
