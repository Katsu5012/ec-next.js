/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useCart } from '@/hooks/useCart';

interface CartProps {
  onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({ onContinueShopping }) => {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">カートが空です</h2>
          <p className="text-gray-600 mb-6">商品を追加してください</p>
          <button
            onClick={onContinueShopping}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            買い物を続ける
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ショッピングカート</h1>
        <button onClick={clearCart} className="text-red-600 hover:text-red-700 font-semibold">
          カートを空にする
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {cartItems.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            {/* 商品画像 */}
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            {/* 商品情報 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                ¥{item.product.price.toLocaleString()} / 個
              </p>
              <p className="text-xs text-gray-500">在庫: {item.product.stock}個</p>
            </div>

            {/* 数量調整 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                -
              </button>

              <span className="w-12 text-center font-semibold">{item.quantity}</span>

              <button
                onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.stock}
                className="w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                +
              </button>
            </div>

            {/* 小計 */}
            <div className="text-right min-w-25">
              <p className="text-lg font-bold text-gray-900">
                ¥{(item.product.price * item.quantity).toLocaleString()}
              </p>
            </div>

            {/* 削除ボタン */}
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-red-600 hover:text-red-700 p-2"
              aria-label="削除"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* 合計金額 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>商品数</span>
            <span>{totalItems}個</span>
          </div>
          <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t">
            <span>合計金額 ¥{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-4">
        <button
          onClick={onContinueShopping}
          className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          買い物を続ける
        </button>
        <button
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          onClick={() => alert('購入処理は未実装です')}
        >
          購入手続きへ
        </button>
      </div>
    </div>
  );
};
