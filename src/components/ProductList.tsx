import React from 'react';
import { useRouter } from 'next/router';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useSelectedProduct } from '../hooks/useSelectedProduct';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { isInCart, getCartItemQuantity } = useCart();
  const { selectProduct } = useSelectedProduct();
  const router = useRouter();

  const handleSelectProduct = (product: Product) => {
    selectProduct(product, 1);
    router.push('/quantity');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">商品一覧</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const cartQuantity = getCartItemQuantity(product.id);
          const inCart = isInCart(product.id);
          
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {inCart && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    カート内: {cartQuantity}個
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ¥{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    在庫: {product.stock}個
                  </span>
                </div>
                
                <button
                  onClick={() => handleSelectProduct(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.stock === 0 ? '在庫切れ' : '購入数を選択'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
