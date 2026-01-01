import { useLocalStorage } from "./useLocalStorage";
import { CartItem, Product } from "../types";
import { useCallback } from "react";

/**
 * カート管理のhook
 * カート内の商品リストを永続的に管理
 */
export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "ec-cart-items",
    []
  );

  /**
   * カートに商品を追加
   */
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      // 既に同じ商品がカートにある場合は数量を更新
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;

        // 在庫数を超えないようにチェック
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: Math.min(newQuantity, product.stock),
          addedAt: Date.now(), // 更新日時を記録
        };
        return newItems;
      }

      // 新規商品の追加
      return [
        ...prevItems,
        {
          product,
          quantity: Math.min(quantity, product.stock),
          addedAt: Date.now(),
        },
      ];
    });
  }, []);

  /**
   * カートから商品を削除
   */
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  /**
   * カート内の商品数量を更新
   */
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.min(quantity, item.product.stock),
            }
          : item
      )
    );
  };

  /**
   * カートをクリア
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * カート内の総アイテム数
   */
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * カートの合計金額
   */
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  /**
   * 特定の商品がカートに入っているか確認
   */
  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  /**
   * カート内の特定商品の数量を取得
   */
  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getCartItemQuantity,
  };
}
