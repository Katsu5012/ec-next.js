/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { useMutation } from 'urql';
import { graphql } from '@/gql';
import { useCart } from '@/hooks/useCart';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
          <Card className="mb-4">
            <CardContent className="p-0">
              {cartItems.map((item, index) => (
                <React.Fragment key={item.product.id}>
                  {index > 0 ? <Separator /> : null}
                  <div className="flex items-center gap-3 p-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{item.product.name}</p>
                      <p className="text-muted-foreground text-xs">
                        ¥{item.product.price.toLocaleString()} × {item.quantity}個
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ¥{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between text-muted-foreground mb-2">
                <span>商品数</span>
                <span>{totalItems}個</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-1">
                <span>合計金額</span>
                <span>¥{totalPrice.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右カラム: 配送先フォーム */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">配送先情報</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* 氏名 */}
                <div>
                  <Label htmlFor="name">氏名</Label>
                  <Input
                    {...register('name')}
                    id="name"
                    type="text"
                    placeholder="山田 太郎"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name ? (
                    <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                  ) : null}
                </div>

                {/* 郵便番号 */}
                <div>
                  <Label htmlFor="postalCode">郵便番号（ハイフンなし）</Label>
                  <Input
                    {...register('postalCode')}
                    id="postalCode"
                    type="text"
                    placeholder="1000001"
                    maxLength={7}
                    className={errors.postalCode ? 'border-destructive' : ''}
                  />
                  {errors.postalCode ? (
                    <p className="mt-1 text-sm text-destructive">{errors.postalCode.message}</p>
                  ) : null}
                </div>

                {/* 都道府県 */}
                <div>
                  <Label htmlFor="prefecture">都道府県</Label>
                  <Input
                    {...register('prefecture')}
                    id="prefecture"
                    type="text"
                    placeholder="東京都"
                    className={errors.prefecture ? 'border-destructive' : ''}
                  />
                  {errors.prefecture ? (
                    <p className="mt-1 text-sm text-destructive">{errors.prefecture.message}</p>
                  ) : null}
                </div>

                {/* 住所 */}
                <div>
                  <Label htmlFor="address">住所（市区町村・番地）</Label>
                  <Input
                    {...register('address')}
                    id="address"
                    type="text"
                    placeholder="千代田区千代田1-1"
                    className={errors.address ? 'border-destructive' : ''}
                  />
                  {errors.address ? (
                    <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
                  ) : null}
                </div>

                {/* 電話番号 */}
                <div>
                  <Label htmlFor="phone">電話番号（ハイフンなし）</Label>
                  <Input
                    {...register('phone')}
                    id="phone"
                    type="tel"
                    placeholder="09012345678"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone ? (
                    <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* サーバーエラー */}
            {serverError ? (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            {/* 注文確定ボタン */}
            <div className="mt-6 space-y-3">
              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    処理中...
                  </>
                ) : (
                  `注文を確定する（¥${totalPrice.toLocaleString()}）`
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => router.push('/cart')}
              >
                カートに戻る
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
