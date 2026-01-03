import { useQuery } from 'urql';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { AuthGuard } from '@/components/AuthGuard';
import { graphql } from '@/gql';

export const ProductsQuery = graphql(`
  query ProductsQuery {
    products {
      id
      ...ProductCardFragment
    }
  }
`);

export default function Home() {
  const [result] = useQuery({ query: ProductsQuery });

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

          {data?.products && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-8 text-gray-900">商品一覧</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((p) => {
                  return <ProductCard data={p} key={p.id} />;
                })}
              </div>
            </div>
          )}
        </main>
      </AuthGuard>
    </>
  );
}
