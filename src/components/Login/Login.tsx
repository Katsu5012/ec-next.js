// src/components/Login.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // ✅ zodResolverを追加
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    const result = await login(data);

    if (result.success) {
      onSuccess?.();
    } else {
      setServerError(result.error || 'ログインに失敗しました');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle role="heading" aria-level={2} className="text-3xl">
              アカウントにログイン
            </CardTitle>
            <CardDescription>ECサイトへようこそ</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* メールアドレス */}
                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    {...register('email')}
                    id="email"
                    autoComplete="email"
                    placeholder="example@email.com"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email ? (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  ) : null}
                </div>

                {/* パスワード */}
                <div>
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password ? (
                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                  ) : null}
                </div>
              </div>

              {/* サーバーエラー */}
              {serverError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              ) : null}

              {/* ログインボタン */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ログイン中...
                  </>
                ) : (
                  'ログイン'
                )}
              </Button>

              {/* デモ用情報 */}
              <Alert>
                <AlertDescription>
                  <p className="mb-1 font-semibold">デモ用アカウント</p>
                  <p className="text-xs">
                    メール: demo@example.com
                    <br />
                    パスワード: password123
                  </p>
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
