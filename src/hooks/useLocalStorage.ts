import { useState, useCallback } from 'react';

/**
 * localStorageと同期するカスタムhook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初期値の取得（localStorageから、なければinitialValue）
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // 値の更新とlocalStorageへの保存
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;

          if (typeof window !== 'undefined') {
            // null または undefined の場合は削除
            if (valueToStore === null || valueToStore === undefined) {
              window.localStorage.removeItem(key);
            } else {
              window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
          }

          return valueToStore;
        });
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
