// src/hooks/useAuth.ts
import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { User, LoginInput, AuthState, LoginResult } from "../types/auth";
import { useMutation } from "urql";
import { LOGIN } from "../graphql/mutations";

export function useAuth() {
  const [authState, setAuthState] = useLocalStorage<AuthState | null>(
    "auth-state",
    {
      user: null,
      token: null,
      isAuthenticated: false,
    }
  );

  const [loginResult, executeLogin] = useMutation(LOGIN);

  const login = useCallback(
    async (input: LoginInput): Promise<LoginResult> => {
      const result = await executeLogin({ input });

      if (result.data?.login) {
        const { token, user } = result.data.login;
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
        return { success: true };
      }

      return {
        success: false,
        error: result.error?.message || "ログインに失敗しました",
      };
    },
    [executeLogin, setAuthState]
  );

  const logout = useCallback(() => {
    setAuthState(null);
  }, [setAuthState]);

  return {
    user: authState?.user,
    token: authState?.token,
    isAuthenticated: authState?.isAuthenticated,
    login,
    logout,
    isLoading: loginResult.fetching,
  };
}
