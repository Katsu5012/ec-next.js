export type MockOrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface MockOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface MockOrder {
  id: string;
  totalPrice: number;
  items: MockOrderItem[];
  createdAt: string;
  status: MockOrderStatus;
}

export const mockOrders: MockOrder[] = [
  {
    id: 'order-001',
    createdAt: '2026-02-28T10:30:00.000Z',
    status: 'DELIVERED',
    items: [
      { productId: '1', productName: 'ワイヤレスイヤホン', price: 8980, quantity: 2 },
      { productId: '4', productName: 'ワイヤレスマウス', price: 3980, quantity: 1 },
    ],
    totalPrice: 21940,
  },
  {
    id: 'order-002',
    createdAt: '2026-03-01T15:00:00.000Z',
    status: 'SHIPPED',
    items: [{ productId: '2', productName: 'スマートウォッチ', price: 24800, quantity: 1 }],
    totalPrice: 24800,
  },
  {
    id: 'order-003',
    createdAt: '2026-03-02T09:00:00.000Z',
    status: 'PROCESSING',
    items: [
      { productId: '5', productName: 'メカニカルキーボード', price: 12800, quantity: 1 },
      { productId: '6', productName: 'Webカメラ', price: 6980, quantity: 1 },
    ],
    totalPrice: 19780,
  },
];
