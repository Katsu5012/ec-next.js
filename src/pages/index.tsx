import { useQuery } from 'urql';
import { Header } from '@/components/Header';
import { ProductList } from '@/components/ProductList';
import { GET_PRODUCTS } from '@/graphql/queries';
import { AuthGuard } from '@/components/AuthGuard';

export default function Home() {
  const [result] = useQuery({ query: GET_PRODUCTS });

  const { data, fetching, error } = result;

  return (
    <>
      <Header />
      <AuthGuard>
        <main>
          {fetching && (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">読み込み中...</p>
            </div>
          )}

          {error && (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
              <p className="text-red-600">エラーが発生しました: {error.message}</p>
            </div>
          )}

          {data?.products && <ProductList products={data.products} />}
        </main>
      </AuthGuard>
    </>
  );
}
