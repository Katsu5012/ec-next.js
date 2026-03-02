/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CartProps {
  onContinueShopping: () => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ onContinueShopping, onCheckout }) => {
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
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">カートが空です</h2>
          <p className="text-muted-foreground mb-6">商品を追加してください</p>
          <Button onClick={onContinueShopping} size="lg">
            買い物を続ける
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ショッピングカート</h1>
        <Button variant="link" className="text-destructive" onClick={clearCart}>
          カートを空にする
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          {cartItems.map((item, index) => (
            <React.Fragment key={item.product.id}>
              {index > 0 ? <Separator /> : null}
              <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                {/* 商品画像 */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* 商品情報 */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    ¥{item.product.price.toLocaleString()} / 個
                  </p>
                  <p className="text-xs text-muted-foreground">在庫: {item.product.stock}個</p>
                </div>

                {/* 数量調整 */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                    aria-label="-"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="w-12 text-center font-semibold">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    aria-label="+"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* 小計 */}
                <div className="text-right min-w-25">
                  <p className="text-lg font-bold text-gray-900">
                    ¥{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* 削除ボタン */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(item.product.id)}
                  aria-label="削除"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      {/* 合計金額 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-muted-foreground">
              <span>商品数</span>
              <span>{totalItems}個</span>
            </div>
            <Separator />
            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
              <span>合計金額 ¥{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" size="lg" onClick={onContinueShopping}>
          買い物を続ける
        </Button>
        <Button className="flex-1" size="lg" onClick={onCheckout}>
          購入手続きへ
        </Button>
      </div>
    </div>
  );
};
