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

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface ProductReviews {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalCount: number;
}
