import { useRouter } from 'next/router';
import { Header } from '@/components/Header/Header';
import { AuthGuard } from '@/components/AuthGuard';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderCompletePage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main>
        <AuthGuard>
          <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <CheckCircle className="mx-auto mb-6 h-24 w-24 text-green-500" />
            <h1 className="mb-4 text-3xl font-bold text-gray-900">ご注文ありがとうございます</h1>
            <p className="mb-2 text-muted-foreground">ご注文を受け付けました。</p>
            <p className="mb-10 text-muted-foreground">
              確認メールをお送りしますので、しばらくお待ちください。
            </p>
            <Button size="lg" onClick={() => router.push('/')}>
              商品一覧に戻る
            </Button>
          </div>
        </AuthGuard>
      </main>
    </>
  );
}
