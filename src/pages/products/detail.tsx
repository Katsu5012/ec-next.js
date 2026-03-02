import { useRouter } from 'next/router';
import { useQuery } from 'urql';

import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { ProductDetailTabs } from '@/components/ProductDetailTabs';
import { Header } from '@/components/Header/Header';
import { graphql } from '@/gql';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const GetProductQuery = graphql(`
  query GetProductQuery($id: ID!) {
    product(id: $id) {
      id
      name
      ...ProductDetailFragment
    }
  }
`);

export default function ProductDetailPage() {
  const router = useRouter();
  const { productId } = router.query;

  // ✅ 商品情報はcache-first（静的データ）
  const [{ data, fetching, error }] = useQuery({
    query: GetProductQuery,
    variables: { id: productId as string },
    requestPolicy: 'cache-first',
    pause: !productId, // idがない場合は実行しない
  });

  if (!productId) {
    return null;
  }

  if (fetching) {
    return (
      <AuthGuard>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>エラーが発生しました: {error.message}</AlertDescription>
            </Alert>
            <Link href="/" className="text-primary hover:underline">
              トップページに戻る
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!data?.product) {
    return (
      <AuthGuard>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">商品が見つかりませんでした</p>
            <Link href="/" className="text-primary hover:underline">
              トップページに戻る
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-primary hover:underline">
                トップ
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-gray-900">{data.product.name}</li>
          </ol>
        </nav>

        {/* タブ付き詳細 */}
        <ProductDetailTabs productData={data.product} productId={productId as string} />
      </div>
    </AuthGuard>
  );
}
