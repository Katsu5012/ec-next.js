import { useRouter } from 'next/router';
import { Header } from '@/components/Header/Header';
import { AuthGuard } from '@/components/AuthGuard';

const CHECK_ICON = (
  <svg
    className="mx-auto h-24 w-24 text-green-500 mb-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function OrderCompletePage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main>
        <AuthGuard>
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            {CHECK_ICON}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ご注文ありがとうございます</h1>
            <p className="text-gray-600 mb-2">ご注文を受け付けました。</p>
            <p className="text-gray-600 mb-10">
              確認メールをお送りしますので、しばらくお待ちください。
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              商品一覧に戻る
            </button>
          </div>
        </AuthGuard>
      </main>
    </>
  );
}
