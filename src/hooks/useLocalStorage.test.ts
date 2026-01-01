import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  it('初期値を返すべき', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('値を設定できるべき', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  it('localStorageに値を保存するべき', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('stored-value');
    });

    const stored = localStorage.getItem('test-key');
    expect(stored).toBe(JSON.stringify('stored-value'));
  });

  it('localStorageから値を読み込むべき', () => {
    localStorage.setItem('test-key', JSON.stringify('existing-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('existing-value');
  });

  it('関数型更新をサポートするべき', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 5));
    
    act(() => {
      result.current[1]((prev) => prev + 10);
    });

    expect(result.current[0]).toBe(15);
  });

  it('オブジェクトを保存できるべき', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', { name: 'test', count: 0 })
    );
    
    act(() => {
      result.current[1]({ name: 'updated', count: 5 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
  });

  it('配列を保存できるべき', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1, 2, 3]));
    
    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
  });
});
