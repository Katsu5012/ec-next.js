import React from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { OrderStatus } from '@/gql/graphql';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const GET_ORDERS = graphql(`
  query GetOrdersQuery {
    orders {
      id
      createdAt
      totalPrice
      status
      items {
        productId
        productName
        price
        quantity
      }
    }
  }
`);

const STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: '注文受付',
  [OrderStatus.Processing]: '処理中',
  [OrderStatus.Shipped]: '発送済み',
  [OrderStatus.Delivered]: '配達完了',
  [OrderStatus.Cancelled]: 'キャンセル',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  [OrderStatus.Processing]: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  [OrderStatus.Shipped]: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  [OrderStatus.Delivered]: 'bg-green-100 text-green-800 hover:bg-green-100',
  [OrderStatus.Cancelled]: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export const OrderHistory: React.FC = () => {
  const [result] = useQuery({ query: GET_ORDERS });
  const { data, fetching, error } = result;

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-destructive">注文履歴の取得に失敗しました。</p>
      </div>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">注文履歴</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-2">注文履歴がありません</p>
          <p className="text-muted-foreground text-sm">ご注文後、こちらに履歴が表示されます</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              {/* 注文ヘッダー */}
              <div className="bg-muted px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-gray-900">注文番号: </span>
                    <span className="font-mono">{order.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">注文日: </span>
                    {new Date(order.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <Badge className={cn(STATUS_COLOR[order.status])}>
                  {STATUS_LABEL[order.status]}
                </Badge>
              </div>

              <Separator />

              {/* 商品リスト */}
              <CardContent className="p-0">
                {order.items.map((item, index) => (
                  <React.Fragment key={item.productId}>
                    {index > 0 ? <Separator /> : null}
                    <div className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          ¥{item.price.toLocaleString()} × {item.quantity}個
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </CardContent>

              <Separator />

              {/* 合計 */}
              <div className="bg-muted px-6 py-4 flex justify-end">
                <div className="text-right">
                  <span className="text-muted-foreground mr-4">合計金額</span>
                  <span className="text-xl font-bold text-gray-900">
                    ¥{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
