import React from "react";
import { useSelectedProduct } from "../hooks/useSelectedProduct";
import { useCart } from "../hooks/useCart";

interface QuantitySelectionProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const QuantitySelection: React.FC<QuantitySelectionProps> = ({
  onComplete,
  onCancel,
}) => {
  const {
    selectedProduct,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearSelection,
  } = useSelectedProduct();

  const { addToCart, getCartItemQuantity } = useCart();

  // 選択中の商品がない場合
  if (!selectedProduct) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">商品が選択されていません</p>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          商品一覧に戻る
        </button>
      </div>
    );
  }

  const { product, quantity } = selectedProduct;
  const totalPrice = product.price * quantity;

  // カート内の既存数量を取得
  const cartQuantity = getCartItemQuantity(product.id);
  const hasInCart = cartQuantity > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    clearSelection();
    onComplete();
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      updateQuantity(value);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">購入数の選択</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* 商品画像 */}
          <div className="md:w-1/2">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* 商品情報・数量選択 */}
          <div className="md:w-1/2 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>

            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ¥{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">/ 個</span>
              </div>
              <p className="text-sm text-gray-500">在庫: {product.stock}個</p>
            </div>

            {/* カート内の既存数量の表示 */}
            {hasInCart && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-blue-900">
                    カート内の状態
                  </span>
                </div>
                <p className="text-sm text-blue-800">
                  この商品は既に{cartQuantity}個カートに入っています
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  追加すると合計{cartQuantity + quantity}個になります
                </p>
              </div>
            )}

            {/* 数量選択 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {hasInCart ? "追加する数量" : "購入数"}
              </label>

              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 text-gray-700 font-bold text-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-24 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />

                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 text-gray-700 font-bold text-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                最大 {product.stock}個まで選択できます
              </p>
            </div>

            {/* 合計金額 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">
                  {hasInCart ? "追加分の小計" : "小計"}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ¥{totalPrice.toLocaleString()}
                </span>
              </div>
              {hasInCart && (
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">カート追加後の合計</span>
                  <span className="font-bold text-gray-900">
                    ¥
                    {(
                      (cartQuantity + quantity) *
                      product.price
                    ).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {hasInCart ? "カートに追加" : "カートに追加"}
              </button>

              <button
                onClick={() => {
                  clearSelection();
                  onCancel();
                }}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
