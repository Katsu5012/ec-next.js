import { Product } from '../types';

/**
 * サンプル商品データ
 */
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'ワイヤレスイヤホン',
    price: 8980,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    stock: 15,
    description: '高音質なワイヤレスイヤホン',
  },
  {
    id: '2',
    name: 'スマートウォッチ',
    price: 24800,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 8,
    description: '多機能スマートウォッチ',
  },
  {
    id: '3',
    name: 'ノートパソコン',
    price: 89800,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    stock: 5,
    description: '高性能ノートPC',
  },
  {
    id: '4',
    name: 'ワイヤレスマウス',
    price: 3980,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    stock: 20,
    description: 'エルゴノミクスマウス',
  },
  {
    id: '5',
    name: 'メカニカルキーボード',
    price: 12800,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    stock: 12,
    description: 'RGB対応メカニカルキーボード',
  },
  {
    id: '6',
    name: 'Webカメラ',
    price: 6980,
    imageUrl: 'https://images.unsplash.com/photo-1588847275797-d2a1c3742b28?w=400',
    stock: 10,
    description: 'フルHD対応Webカメラ',
  },
];
