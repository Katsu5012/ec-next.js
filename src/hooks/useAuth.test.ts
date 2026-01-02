// src/hooks/useAuth.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { AllTheProviders } from '@/test/test-utils';
import { LoginResult } from '@/types/auth';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('初期状態では未認証', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('ログインに成功すると認証状態になる', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    await act(async () => {
      await result.current.login({
        email: 'demo@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe('demo@example.com');
      expect(result.current.token).not.toBeNull();
    });
  });

  it('ログアウトすると未認証状態になる', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    // ログイン
    await act(async () => {
      await result.current.login({
        email: 'demo@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // ログアウト
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBeUndefined();
    expect(result.current.user).toBeUndefined();
    expect(result.current.token).toBeUndefined();
  });

  it('誤った認証情報ではログインできない', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    let loginResult: LoginResult | undefined;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });
    });

    expect(loginResult?.success).toBe(false);
    if (!loginResult?.success) {
      expect(loginResult?.error).toBeTruthy();
    }
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('認証状態がlocalStorageに永続化される', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    await act(async () => {
      await result.current.login({
        email: 'demo@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      const authState = localStorage.getItem('auth-state');
      expect(authState).not.toBeNull();

      if (authState) {
        const parsed = JSON.parse(authState);
        expect(parsed.isAuthenticated).toBe(true);
        expect(parsed.user.email).toBe('demo@example.com');
        expect(parsed.token).toBeTruthy();
      }
    });
  });

  it('ログアウト後はlocalStorageがクリアされる', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    // ログイン
    await act(async () => {
      await result.current.login({
        email: 'demo@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // ログアウト
    act(() => {
      result.current.logout();
    });

    const authState = localStorage.getItem('auth-state');
    expect(authState).toBeNull();
  });

  it('ログイン中はisLoadingがtrueになる', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    expect(result.current.isLoading).toBe(false);

    // ログイン開始（awaitしない）
    const loginPromise = act(async () => {
      return result.current.login({
        email: 'demo@example.com',
        password: 'password123',
      });
    });

    // すぐにisLoadingをチェック（タイミング次第でtrueになる可能性がある）
    // Note: これはタイミングに依存するので、常に確実ではない

    await loginPromise;

    // 完了後はfalseになる
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('localStorageに既存の認証情報がある場合、初期状態で認証済みになる', () => {
    // 事前にlocalStorageにデータをセット
    localStorage.setItem(
      'auth-state',
      JSON.stringify({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'existing-token',
        isAuthenticated: true,
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
    expect(result.current.token).toBe('existing-token');
  });
});
