import type { Meta, StoryObj } from '@storybook/react';
import { Provider as UrqlProvider } from 'urql';
import { http, HttpResponse } from 'msw';
import { OrderHistory } from './OrderHistory';
import { createUrqlClient } from '../../lib/urql';
import { mockOrders } from '../../data/orders';

const urqlClient = createUrqlClient();

const meta = {
  title: 'Components/OrderHistory',
  component: OrderHistory,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: '/orders',
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
} satisfies Meta<typeof OrderHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [http.post('/graphql', () => HttpResponse.json({ data: { orders: [] } }))],
    },
  },
};

export const WithManyOrders: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/graphql', () =>
          HttpResponse.json({
            data: {
              orders: [
                ...mockOrders,
                {
                  id: 'order-004',
                  createdAt: '2026-01-15T08:00:00.000Z',
                  status: 'CANCELLED',
                  items: [
                    { productId: '3', productName: 'ノートパソコン', price: 89800, quantity: 1 },
                  ],
                  totalPrice: 89800,
                },
              ],
            },
          })
        ),
      ],
    },
  },
};
