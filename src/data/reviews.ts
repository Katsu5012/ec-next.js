import type { ProductReviews } from '../types';

export const mockReviews: Record<string, ProductReviews> = {
  '1': {
    productId: '1',
    averageRating: 4.5,
    totalCount: 5,
    reviews: [
      {
        id: 'review-1-1',
        userId: 'user-1',
        userName: '田中太郎',
        rating: 5,
        comment:
          '音質が素晴らしいです！ノイズキャンセリングも優秀で、通勤時に重宝しています。バッテリーの持ちも良く、満足しています。',
        createdAt: '2024-12-20T10:00:00Z',
      },
      {
        id: 'review-1-2',
        userId: 'user-2',
        userName: '佐藤花子',
        rating: 4,
        comment:
          'バッテリーの持ちが良く、長時間の使用でも問題ありません。デザインも気に入っています。ただ、ケースがもう少しコンパクトだと嬉しいです。',
        createdAt: '2024-12-18T15:30:00Z',
      },
      {
        id: 'review-1-3',
        userId: 'user-3',
        userName: '鈴木一郎',
        rating: 5,
        comment: 'コスパ最高！この価格でこの音質は驚きです。Bluetooth接続も安定しています。',
        createdAt: '2024-12-15T09:15:00Z',
      },
      {
        id: 'review-1-4',
        userId: 'user-4',
        userName: '山田次郎',
        rating: 4,
        comment: '装着感が良く、長時間つけていても疲れません。音質も価格以上だと思います。',
        createdAt: '2024-12-10T14:20:00Z',
      },
      {
        id: 'review-1-5',
        userId: 'user-5',
        userName: '伊藤美咲',
        rating: 5,
        comment: '通話品質も良好です。リモートワークでも活躍しています。買って良かったです！',
        createdAt: '2024-12-08T11:45:00Z',
      },
    ],
  },
  '2': {
    productId: '2',
    averageRating: 4.3,
    totalCount: 3,
    reviews: [
      {
        id: 'review-2-1',
        userId: 'user-6',
        userName: '高橋健太',
        rating: 5,
        comment: 'トレーニングに最適です。心拍数の測定も正確で、健康管理に役立っています。',
        createdAt: '2024-12-19T16:00:00Z',
      },
      {
        id: 'review-2-2',
        userId: 'user-7',
        userName: '中村真理',
        rating: 4,
        comment: 'デザインがスタイリッシュで気に入っています。通知機能も便利です。',
        createdAt: '2024-12-12T10:30:00Z',
      },
      {
        id: 'review-2-3',
        userId: 'user-8',
        userName: '小林大輔',
        rating: 4,
        comment: 'バッテリーの持ちが良いのが嬉しいです。一週間充電なしで使えます。',
        createdAt: '2024-12-05T13:15:00Z',
      },
    ],
  },
  '3': {
    productId: '3',
    averageRating: 4.7,
    totalCount: 4,
    reviews: [
      {
        id: 'review-3-1',
        userId: 'user-9',
        userName: '加藤智子',
        rating: 5,
        comment: '大容量で旅行に最適！スマホを何度も充電できます。重宝しています。',
        createdAt: '2024-12-21T09:00:00Z',
      },
      {
        id: 'review-3-2',
        userId: 'user-10',
        userName: '渡辺直樹',
        rating: 5,
        comment: '急速充電に対応していて便利です。3台同時充電できるのも良いです。',
        createdAt: '2024-12-17T14:45:00Z',
      },
      {
        id: 'review-3-3',
        userId: 'user-11',
        userName: '松本優子',
        rating: 4,
        comment: '容量が大きいので少し重いですが、その分安心感があります。',
        createdAt: '2024-12-14T11:20:00Z',
      },
      {
        id: 'review-3-4',
        userId: 'user-12',
        userName: '木村拓也',
        rating: 5,
        comment: 'LED表示で残量が分かりやすいです。コスパも良く、おすすめです！',
        createdAt: '2024-12-11T16:30:00Z',
      },
    ],
  },
};
