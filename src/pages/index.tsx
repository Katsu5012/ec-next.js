import { useQuery } from 'urql';
import { Header } from '@/components/Header/Header';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { AuthGuard } from '@/components/AuthGuard';
import { graphql } from '@/gql';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
          {fetching ? (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">読み込み中...</p>
            </div>
          ) : null}

          {error ? (
            <div className="mx-auto max-w-7xl px-4 py-16">
              <Alert variant="destructive">
                <AlertDescription>エラーが発生しました: {error.message}</AlertDescription>
              </Alert>
            </div>
          ) : null}

          {data?.products ? (
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h1 className="mb-8 text-3xl font-bold text-gray-900">商品一覧</h1>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.products.map((p) => {
                  return <ProductCard data={p} key={p.id} />;
                })}
              </div>
            </div>
          ) : null}
        </main>
      </AuthGuard>
    </>
  );
}
