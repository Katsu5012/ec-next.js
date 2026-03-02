// src/components/AuthGuard.tsx
import { useRouter } from 'next/router';
import { Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
  };

  // ログイン中はローディング表示
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // ログインしていない場合はメッセージとボタン表示
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* アイコン */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>

              {/* メッセージ */}
              <h2 className="mb-2 text-2xl font-bold text-gray-900">ログインが必要です</h2>
              <p className="mb-6 text-gray-600">このページを表示するには、ログインしてください</p>

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
