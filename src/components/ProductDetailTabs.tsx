// NOTE: このコンポーネントいらないのでtabコンポーネントを作って親元にデータ持っていく
import React, { useState } from 'react';
import { useQuery } from 'urql';
import { ProductReviews } from './ProductReviews';
import { graphql, type FragmentType } from '@/gql';
import { ProductDetailFragment, ProductDetail } from './ProductDetail';

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
    <div>
      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            商品情報
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            レビュー
          </button>
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="mt-6">
        {activeTab === 'info' && <ProductDetail data={productData} />}

        {activeTab === 'reviews' && (
          <>
            {reviewsFetching && !reviewsData ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : reviewsData?.productReviews ? (
              <ProductReviews
                data={reviewsData.productReviews}
                onRefresh={handleRefreshReviews}
                isRefreshing={reviewsFetching}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                レビューの読み込みに失敗しました
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
