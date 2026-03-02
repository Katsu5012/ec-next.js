import { useSyncExternalStore, useCallback } from 'react';

/**
 * キーごとのリスナー管理（同一タブ内の変更通知用）
 */
const listeners = new Map<string, Set<() => void>>();

function getListeners(key: string): Set<() => void> {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  return set;
}

function emitChange(key: string): void {
  for (const listener of getListeners(key)) {
    listener();
  }
}

/**
 * localStorageと同期するカスタムhook
 *
 * useSyncExternalStore を使用し、SSR/ハイドレーション時は initialValue を返す。
 * ハイドレーション完了後に自動的にlocalStorageの値へ切り替わるため、
 * mounted フラグや useEffect での初期化は不要。
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const serializedInitial = JSON.stringify(initialValue);

  const subscribe = useCallback(
    (callback: () => void) => {
      const keyListeners = getListeners(key);
      keyListeners.add(callback);

      // 他タブからの変更を検知
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener('storage', handleStorage);

      return () => {
        keyListeners.delete(callback);
        window.removeEventListener('storage', handleStorage);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : serializedInitial;
    } catch {
      return serializedInitial;
    }
  }, [key, serializedInitial]);

  const getServerSnapshot = useCallback(() => serializedInitial, [serializedInitial]);

  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // rawValue は JSON 文字列なので、同じ文字列なら同じ参照のパース結果を返す
  const value: T = JSON.parse(rawValue);

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const currentRaw = window.localStorage.getItem(key);
        const currentValue: T = currentRaw !== null ? JSON.parse(currentRaw) : initialValue;
        const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;

        // null/undefined も JSON.stringify で "null" として保存し、
        // getSnapshot で正しく読み取れるようにする（removeItem だと initialValue にフォールバックしてしまう）
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        emitChange(key);
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key, initialValue]
  );

  return [value, setValue] as const;
}
