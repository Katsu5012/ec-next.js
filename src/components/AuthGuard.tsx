// src/components/AuthGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 初回チェック完了
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsChecking(false);
  }, []);

  const handleLogin = () => {
    router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
  };

  // 初回チェック中はローディング表示
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ログインしていない場合はメッセージとボタン表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* アイコン */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* メッセージ */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ログインが必要です</h2>
            <p className="text-gray-600 mb-6">このページを表示するには、ログインしてください</p>

            {/* ログインボタン */}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ログインページへ
            </button>

            {/* 追加情報 */}
            <p className="mt-4 text-sm text-gray-500">ログイン後、このページに戻ります</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
