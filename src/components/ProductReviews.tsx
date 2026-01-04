import React from 'react';
import { FragmentType, readFragment, graphql } from '@/gql';

export const ProductReviewFragment = graphql(`
  fragment ProductReviewFragment on Review {
    id
    userId
    userName
    rating
    comment
    createdAt
  }
`);

export const ProductReviewsFragment = graphql(`
  fragment ProductReviewsFragment on ProductReviews {
    productId
    averageRating
    totalCount
    reviews {
      id
      ...ProductReviewFragment
    }
  }
`);

interface ProductReviewsProps {
  data: FragmentType<typeof ProductReviewsFragment>;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  data,
  onRefresh,
  isRefreshing = false,
}) => {
  const reviewsData = readFragment(ProductReviewsFragment, data);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">カスタマーレビュー</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold text-yellow-500">
                {reviewsData.averageRating.toFixed(1)}
              </span>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(reviewsData.averageRating) ? 'fill-current' : 'fill-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="text-gray-600">{reviewsData.totalCount}件のレビュー</span>
          </div>
        </div>

        {/* リロードボタン */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <svg
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefreshing ? '更新中...' : '最新に更新'}
          </button>
        )}
      </div>

      {/* レビューリスト */}
      <div className="space-y-4">
        {reviewsData.reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">まだレビューがありません</div>
        ) : (
          reviewsData.reviews.map((review) => <ReviewItem key={review.id} data={review} />)
        )}
      </div>
    </div>
  );
};

// ✅ レビュー単体コンポーネント
interface ReviewItemProps {
  data: FragmentType<typeof ProductReviewFragment>;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ data }) => {
  const review = readFragment(ProductReviewFragment, data);

  return (
    <div className="border-b pb-4 last:border-b-0">
      <div className="flex items-center gap-4 mb-2">
        <span className="font-semibold text-gray-900">{review.userName}</span>
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString('ja-JP')}
        </span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};
