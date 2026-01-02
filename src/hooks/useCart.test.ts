import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCart } from './useCart';
import { Product } from '../types';

const mockProduct1: Product = {
  id: '1',
  name: '商品A',
  price: 1000,
  imageUrl: 'https://example.com/a.jpg',
  stock: 10,
};

const mockProduct2: Product = {
  id: '2',
  name: '商品B',
  price: 2000,
  imageUrl: 'https://example.com/b.jpg',
  stock: 5,
};

describe('useCart', () => {
  it('初期状態は空の配列であるべき', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cartItems).toEqual([]);
  });

  it('商品をカートに追加できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].product.id).toBe('1');
    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  it('複数の異なる商品を追加できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 1);
      result.current.addToCart(mockProduct2, 3);
    });

    expect(result.current.cartItems).toHaveLength(2);
  });

  it('同じ商品を追加すると数量が加算されるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 2);
      result.current.addToCart(mockProduct1, 3);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  it('在庫数を超えて追加できないべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 8);
      result.current.addToCart(mockProduct1, 5);
    });

    // 在庫が10なので、合計で10を超えない
    expect(result.current.cartItems[0].quantity).toBe(10);
  });

  it('商品をカートから削除できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 2);
      result.current.addToCart(mockProduct2, 1);
    });

    act(() => {
      result.current.removeFromCart('1');
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].product.id).toBe('2');
  });

  it('カート内の商品数量を更新できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 2);
    });

    act(() => {
      result.current.updateCartItemQuantity('1', 5);
    });

    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  it('数量を0にすると商品が削除されるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 2);
    });

    act(() => {
      result.current.updateCartItemQuantity('1', 0);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('カートをクリアできるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 2);
      result.current.addToCart(mockProduct2, 1);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('総アイテム数を計算できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 3);
      result.current.addToCart(mockProduct2, 2);
    });

    expect(result.current.getTotalItems()).toBe(5);
  });

  it('合計金額を計算できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 2); // 1000 * 2 = 2000
      result.current.addToCart(mockProduct2, 3); // 2000 * 3 = 6000
    });

    expect(result.current.getTotalPrice()).toBe(8000);
  });

  it('商品がカートに入っているか確認できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 1);
    });

    expect(result.current.isInCart('1')).toBe(true);
    expect(result.current.isInCart('2')).toBe(false);
  });

  it('カート内の特定商品の数量を取得できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 5);
    });

    expect(result.current.getCartItemQuantity('1')).toBe(5);
    expect(result.current.getCartItemQuantity('2')).toBe(0);
  });

  it('localStorageに保存されるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct1, 3);
    });

    const stored = localStorage.getItem('ec-cart-items');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].quantity).toBe(3);
  });
});
