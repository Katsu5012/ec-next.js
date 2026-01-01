import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSelectedProduct } from './useSelectedProduct';
import { Product } from '../types';

const mockProduct: Product = {
  id: '1',
  name: 'テスト商品',
  price: 1000,
  imageUrl: 'https://example.com/image.jpg',
  stock: 10,
  description: 'テスト用の商品',
};

describe('useSelectedProduct', () => {
  it('初期状態はnullであるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    expect(result.current.selectedProduct).toBeNull();
  });

  it('商品を選択できるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 2);
    });

    expect(result.current.selectedProduct).toEqual({
      product: mockProduct,
      quantity: 2,
    });
  });

  it('購入数を更新できるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 1);
    });
    
    act(() => {
      result.current.updateQuantity(5);
    });

    expect(result.current.selectedProduct?.quantity).toBe(5);
  });

  it('購入数を増やせるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 3);
    });
    
    act(() => {
      result.current.incrementQuantity();
    });

    expect(result.current.selectedProduct?.quantity).toBe(4);
  });

  it('購入数を減らせるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 3);
    });
    
    act(() => {
      result.current.decrementQuantity();
    });

    expect(result.current.selectedProduct?.quantity).toBe(2);
  });

  it('在庫数を超える購入数は設定できないべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 5);
    });
    
    act(() => {
      result.current.updateQuantity(15);
    });

    // 在庫が10なので、10を超える数は設定されない
    expect(result.current.selectedProduct?.quantity).toBe(5);
  });

  it('購入数が1未満にはならないべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 1);
    });
    
    act(() => {
      result.current.decrementQuantity();
    });

    // 1から減らそうとしても1のまま
    expect(result.current.selectedProduct?.quantity).toBe(1);
  });

  it('在庫数まで増やせるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 9);
    });
    
    act(() => {
      result.current.incrementQuantity();
    });

    expect(result.current.selectedProduct?.quantity).toBe(10);
  });

  it('在庫数を超えて増やせないべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 10);
    });
    
    act(() => {
      result.current.incrementQuantity();
    });

    // 在庫が10なので、それ以上は増やせない
    expect(result.current.selectedProduct?.quantity).toBe(10);
  });

  it('選択をクリアできるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 1);
    });
    
    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedProduct).toBeNull();
  });

  it('localStorageに保存されるべき', () => {
    const { result } = renderHook(() => useSelectedProduct());
    
    act(() => {
      result.current.selectProduct(mockProduct, 3);
    });

    const stored = localStorage.getItem('ec-selected-product');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.quantity).toBe(3);
    expect(parsed.product.id).toBe('1');
  });
});
