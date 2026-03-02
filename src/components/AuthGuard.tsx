// src/components/AuthGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // ログインしていない場合はメッセージとボタン表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* アイコン */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>

              {/* メッセージ */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ログインが必要です</h2>
              <p className="text-gray-600 mb-6">このページを表示するには、ログインしてください</p>

              {/* ログインボタン */}
              <Button onClick={handleLogin} size="lg" className="w-full">
                ログインページへ
              </Button>

              {/* 追加情報 */}
              <p className="mt-4 text-sm text-muted-foreground">ログイン後、このページに戻ります</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
