import React from 'react';
import { useSelectedProduct } from '@/hooks/useSelectedProduct';
import { useCart } from '@/hooks/useCart';
import { Info, Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QuantitySelectionProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const QuantitySelection: React.FC<QuantitySelectionProps> = ({ onComplete, onCancel }) => {
  const { selectedProduct, updateQuantity, incrementQuantity, decrementQuantity, clearSelection } =
    useSelectedProduct();

  const { addToCart, getCartItemQuantity } = useCart();

  // 選択中の商品がない場合
  if (!selectedProduct) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">商品が選択されていません</p>
        <Button variant="secondary" onClick={onCancel}>
          商品一覧に戻る
        </Button>
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

      <Card className="shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* 商品画像 */}
          <div className="md:w-1/2">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* 商品情報・数量選択 */}
          <CardContent className="md:w-1/2 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>

            {product.description ? (
              <p className="text-gray-600 mb-4">{product.description}</p>
            ) : null}

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ¥{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">/ 個</span>
              </div>
              <p className="text-sm text-muted-foreground">在庫: {product.stock}個</p>
            </div>

            {/* カート内の既存数量の表示 */}
            {hasInCart ? (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>カート内の状態</AlertTitle>
                <AlertDescription>
                  <p>この商品は既に{cartQuantity}個カートに入っています</p>
                  <p className="text-xs mt-1">
                    追加すると合計{cartQuantity + quantity}個になります
                  </p>
                </AlertDescription>
              </Alert>
            ) : null}

            {/* 数量選択 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {hasInCart ? '追加する数量' : '購入数'}
              </label>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label="-"
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <Input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-24 h-12 text-center text-xl font-bold"
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  aria-label="+"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                最大 {product.stock}個まで選択できます
              </p>
            </div>

            {/* 合計金額 */}
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">
                  {hasInCart ? '追加分の小計' : '小計'}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ¥{totalPrice.toLocaleString()}
                </span>
              </div>
              {hasInCart ? (
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">カート追加後の合計</span>
                  <span className="font-bold text-gray-900">
                    ¥{((cartQuantity + quantity) * product.price).toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <Button onClick={handleAddToCart} className="w-full" size="lg">
                カートに追加
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => {
                  clearSelection();
                  onCancel();
                }}
              >
                キャンセル
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
