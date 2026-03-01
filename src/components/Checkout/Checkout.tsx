/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { useMutation } from 'urql';
import { graphql } from '@/gql';
import { useCart } from '@/hooks/useCart';

const CREATE_ORDER = graphql(`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      success
      order {
        id
        totalPrice
        createdAt
      }
      message
    }
  }
`);

const checkoutSchema = z.object({
  name: z.string().min(1, '氏名を入力してください'),
  postalCode: z.string().regex(/^\d{7}$/, '郵便番号は7桁の数字で入力してください（ハイフンなし）'),
  prefecture: z.string().min(1, '都道府県を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, '電話番号は10〜11桁の数字で入力してください（ハイフンなし）'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const router = useRouter();
  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [serverError, setServerError] = useState('');
  const [, executeCreateOrder] = useMutation(CREATE_ORDER);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setServerError('');
    const result = await executeCreateOrder({
      input: {
        shippingAddress: {
          name: data.name,
          postalCode: data.postalCode,
          prefecture: data.prefecture,
          address: data.address,
          phone: data.phone,
        },
      },
    });

    if (result.error) {
      setServerError('注文処理に失敗しました。もう一度お試しください。');
      return;
    }

    if (result.data?.createOrder.success) {
      clearCart();
      router.push('/order-complete');
    } else {
      setServerError(result.data?.createOrder.message ?? '注文処理に失敗しました。');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">購入手続き</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左カラム: 注文内容サマリー */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">注文内容</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-4 border-b last:border-b-0"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.product.name}</p>
                  <p className="text-gray-500 text-xs">
                    ¥{item.product.price.toLocaleString()} × {item.quantity}個
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  ¥{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>商品数</span>
              <span>{totalItems}個</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
              <span>合計金額</span>
              <span>¥{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 右カラム: 配送先フォーム */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">配送先情報</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              {/* 氏名 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  氏名
                </label>
                <input
                  {...register('name')}
                  id="name"
                  type="text"
                  placeholder="山田 太郎"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.name ? (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                ) : null}
              </div>

              {/* 郵便番号 */}
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  郵便番号（ハイフンなし）
                </label>
                <input
                  {...register('postalCode')}
                  id="postalCode"
                  type="text"
                  placeholder="1000001"
                  maxLength={7}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.postalCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.postalCode ? (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                ) : null}
              </div>

              {/* 都道府県 */}
              <div>
                <label
                  htmlFor="prefecture"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  都道府県
                </label>
                <input
                  {...register('prefecture')}
                  id="prefecture"
                  type="text"
                  placeholder="東京都"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.prefecture ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.prefecture ? (
                  <p className="mt-1 text-sm text-red-600">{errors.prefecture.message}</p>
                ) : null}
              </div>

              {/* 住所 */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  住所（市区町村・番地）
                </label>
                <input
                  {...register('address')}
                  id="address"
                  type="text"
                  placeholder="千代田区千代田1-1"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.address ? (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                ) : null}
              </div>

              {/* 電話番号 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号（ハイフンなし）
                </label>
                <input
                  {...register('phone')}
                  id="phone"
                  type="tel"
                  placeholder="09012345678"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone ? (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                ) : null}
              </div>
            </div>

            {/* サーバーエラー */}
            {serverError ? (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{serverError}</p>
              </div>
            ) : null}

            {/* 注文確定ボタン */}
            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    処理中...
                  </span>
                ) : (
                  `注文を確定する（¥${totalPrice.toLocaleString()}）`
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/cart')}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                カートに戻る
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
