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
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ご注文ありがとうございます</h1>
            <p className="text-muted-foreground mb-2">ご注文を受け付けました。</p>
            <p className="text-muted-foreground mb-10">
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
