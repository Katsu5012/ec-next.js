// NOTE: このコンポーネントいらないのでtabコンポーネントを作って親元にデータ持っていく
import React, { useState } from 'react';
import { useQuery } from 'urql';
import { ProductReviews } from './ProductReviews';
import { graphql, type FragmentType } from '@/gql';
import { ProductDetailFragment, ProductDetail } from './ProductDetail';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabType = 'info' | 'reviews';

interface ProductDetailTabsProps {
  productData: FragmentType<typeof ProductDetailFragment>;
  productId: string;
}

export const GetProductReviewsQuery = graphql(`
  query GetProductReviewsQuery($productId: ID!) {
    productReviews(productId: $productId) {
      ...ProductReviewsFragment
    }
  }
`);

export const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ productData, productId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');

  // ✅ レビューは別クエリで取得（network-only戦略）
  const [{ data: reviewsData, fetching: reviewsFetching }, reexecuteReviewsQuery] = useQuery({
    query: GetProductReviewsQuery,
    variables: { productId },
    requestPolicy: 'network-only', // ✅ 常に最新データを取得
    pause: activeTab !== 'reviews', // ✅ レビュータブ以外では実行しない
  });

  const handleRefreshReviews = () => {
    // ✅ 強制再取得
    reexecuteReviewsQuery({ requestPolicy: 'network-only' });
  };

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
      <TabsList>
        <TabsTrigger value="info">商品情報</TabsTrigger>
        <TabsTrigger value="reviews">レビュー</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6">
        <ProductDetail data={productData} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        {reviewsFetching && !reviewsData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : reviewsData?.productReviews ? (
          <ProductReviews
            data={reviewsData.productReviews}
            onRefresh={handleRefreshReviews}
            isRefreshing={reviewsFetching}
          />
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            レビューの読み込みに失敗しました
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
