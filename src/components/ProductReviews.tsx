import React from 'react';
import { FragmentType, readFragment, graphql } from '@/gql';
import { Star, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
    <Card className="shadow-lg">
      <CardContent className="p-6">
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
                    <Star
                      key={i}
                      className={cn(
                        'w-6 h-6',
                        i < Math.round(reviewsData.averageRating)
                          ? 'fill-current'
                          : 'fill-gray-300 text-gray-300'
                      )}
                    />
                  ))}
                </div>
              </div>
              <span className="text-gray-600">{reviewsData.totalCount}件のレビュー</span>
            </div>
          </div>

          {/* リロードボタン */}
          {onRefresh ? (
            <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
              {isRefreshing ? '更新中...' : '最新に更新'}
            </Button>
          ) : null}
        </div>

        {/* レビューリスト */}
        <div className="space-y-4">
          {reviewsData.reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">まだレビューがありません</div>
          ) : (
            reviewsData.reviews.map((review, index) => (
              <React.Fragment key={review.id}>
                {index > 0 ? <Separator /> : null}
                <ReviewItem data={review} />
              </React.Fragment>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ✅ レビュー単体コンポーネント
interface ReviewItemProps {
  data: FragmentType<typeof ProductReviewFragment>;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ data }) => {
  const review = readFragment(ProductReviewFragment, data);

  return (
    <div className="pb-4">
      <div className="flex items-center gap-4 mb-2">
        <span className="font-semibold text-gray-900">{review.userName}</span>
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-4 h-4',
                i < review.rating ? 'fill-current' : 'fill-gray-300 text-gray-300'
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString('ja-JP')}
        </span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};
