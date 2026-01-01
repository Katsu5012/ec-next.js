/**
 * 商品の型定義
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  description?: string;
}

/**
 * カートアイテムの型定義
 */
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number; // タイムスタンプ
}

/**
 * 選択中の商品（購入数選択画面用）
 */
export interface SelectedProduct {
  product: Product;
  quantity: number;
}
