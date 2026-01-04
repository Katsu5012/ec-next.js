import { useRouter } from 'next/router';
import { useQuery } from 'urql';

import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { ProductDetailTabs } from '@/components/ProductDetailTabs';
import { Header } from '@/components/Header';
import { graphql } from '@/gql';

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">エラーが発生しました: {error.message}</p>
            <Link href="/" className="text-blue-600 hover:underline">
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">商品が見つかりませんでした</p>
            <Link href="/" className="text-blue-600 hover:underline">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                トップ
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900">{data.product.name}</li>
          </ol>
        </nav>

        {/* タブ付き詳細 */}
        <ProductDetailTabs productData={data.product} productId={productId as string} />
      </div>
    </AuthGuard>
  );
}
