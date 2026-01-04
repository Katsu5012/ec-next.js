import React, { useState } from 'react';
import { FragmentType, readFragment, graphql } from '@/gql';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/router';
import { Product } from '@/types';

export const ProductDetailFragment = graphql(`
  fragment ProductDetailFragment on Product {
    id
    name
    price
    description
    imageUrl
    stock
  }
`);

interface ProductDetailProps {
  data: FragmentType<typeof ProductDetailFragment>;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ data }) => {
  const product = readFragment(ProductDetailFragment, data);
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product as Product, quantity);
    alert('カートに追加しました');
  };

  const handleBuyNow = () => {
    addToCart(product as Product, quantity);
    router.push('/cart');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 商品画像 */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* 商品情報 */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ¥{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">税込</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700">在庫:</span>
            <span
              className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {product.stock > 0 ? `${product.stock}個` : '在庫切れ'}
            </span>
          </div>

          {product.description && (
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-900">商品説明</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* 数量選択 */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              カートに追加
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              今すぐ購入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
