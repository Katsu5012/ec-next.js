import { graphql, HttpResponse } from 'msw';
import { mockProducts } from '../data/products';

export const handlers = [
  // 商品一覧取得
  graphql.query('GetProducts', () => {
    return HttpResponse.json({
      data: {
        products: mockProducts,
      },
    });
  }),

  // 商品詳細取得
  graphql.query('GetProduct', ({ variables }) => {
    const product = mockProducts.find((p) => p.id === variables.id);
    
    if (!product) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Product not found',
          },
        ],
      });
    }

    return HttpResponse.json({
      data: {
        product,
      },
    });
  }),

  // カートに追加
  graphql.mutation('AddToCart', ({ variables }) => {
    const { productId, quantity } = variables.input as {
      productId: string;
      quantity: number;
    };

    const product = mockProducts.find((p) => p.id === productId);

    if (!product) {
      return HttpResponse.json({
        data: {
          addToCart: {
            success: false,
            message: '商品が見つかりません',
            cartItem: null,
          },
        },
      });
    }

    if (quantity > product.stock) {
      return HttpResponse.json({
        data: {
          addToCart: {
            success: false,
            message: '在庫が不足しています',
            cartItem: null,
          },
        },
      });
    }

    return HttpResponse.json({
      data: {
        addToCart: {
          success: true,
          message: 'カートに追加しました',
          cartItem: {
            product,
            quantity,
            addedAt: new Date().toISOString(),
          },
        },
      },
    });
  }),
];
