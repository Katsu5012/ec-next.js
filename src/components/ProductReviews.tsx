import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FragmentType, readFragment, graphql } from '@/gql';
import { useMutation } from 'urql';

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

const CREATE_REVIEW_MUTATION = graphql(`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      success
      message
      review {
        id
        userId
        userName
        rating
        comment
        createdAt
      }
    }
  }
`);

const reviewSchema = z.object({
  rating: z.number().min(1, '評価を選択してください').max(5),
  comment: z.string().min(1, 'コメントを入力してください'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

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
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(
    null
  );

  const [, createReview] = useMutation(CREATE_REVIEW_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const selectedRating = watch('rating');

  const onSubmit = async (formData: ReviewFormData) => {
    setSubmitResult(null);
    const result = await createReview({
      input: {
        productId: reviewsData.productId,
        rating: formData.rating,
        comment: formData.comment,
      },
    });

    if (result.error || !result.data?.createReview.success) {
      setSubmitResult({
        success: false,
        message: result.data?.createReview.message ?? 'レビューの投稿に失敗しました',
      });
      return;
    }

    setSubmitResult({ success: true, message: 'レビューを投稿しました！' });
    reset({ rating: 0, comment: '' });
    onRefresh?.();
  };

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
        {onRefresh ? (
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
        ) : null}
      </div>

      {/* レビュー投稿フォーム */}
      <div className="border border-gray-200 rounded-lg p-5 mb-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">レビューを投稿する</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 星評価セレクター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              評価 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  className="focus:outline-none"
                  aria-label={`${star}点`}
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= selectedRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-300 text-gray-300'
                    } hover:fill-yellow-300 hover:text-yellow-300`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </button>
              ))}
              {selectedRating > 0 && (
                <span className="ml-2 text-sm text-gray-600 self-center">{selectedRating}点</span>
              )}
            </div>
            {/* hidden input for react-hook-form registration */}
            <input type="hidden" {...register('rating', { valueAsNumber: true })} />
            {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
          </div>

          {/* コメントテキストエリア */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              コメント <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('comment')}
              id="comment"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.comment ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="商品についてのご意見をお聞かせください"
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
            )}
          </div>

          {/* 送信結果メッセージ */}
          {submitResult !== null ? (
            <div
              className={`rounded-md p-3 ${
                submitResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <p className="text-sm">{submitResult.message}</p>
            </div>
          ) : null}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '送信中...' : 'レビューを投稿する'}
          </button>
        </form>
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
