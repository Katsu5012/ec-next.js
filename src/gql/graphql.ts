/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AddToCartInput = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type AddToCartPayload = {
  __typename?: 'AddToCartPayload';
  cartItem?: Maybe<CartItem>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  addedAt: Scalars['String']['output'];
  product: Product;
  quantity: Scalars['Int']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  addToCart: AddToCartPayload;
  login: LoginResponse;
};

export type MutationAddToCartArgs = {
  input: AddToCartInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type Product = {
  __typename?: 'Product';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  stock: Scalars['Int']['output'];
};

export type ProductReviews = {
  __typename?: 'ProductReviews';
  averageRating: Scalars['Float']['output'];
  productId: Scalars['ID']['output'];
  reviews: Array<Review>;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  product?: Maybe<Product>;
  productReviews: ProductReviews;
  products: Array<Product>;
};

export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};

export type QueryProductReviewsArgs = {
  productId: Scalars['ID']['input'];
};

export type Review = {
  __typename?: 'Review';
  comment: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ProductCardFragmentFragment = {
  __typename?: 'Product';
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string | null;
  stock: number;
} & { ' $fragmentName'?: 'ProductCardFragmentFragment' };

export type ProductDetailFragmentFragment = {
  __typename?: 'Product';
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl: string;
  stock: number;
} & { ' $fragmentName'?: 'ProductDetailFragmentFragment' };

export type GetProductReviewsQueryQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;

export type GetProductReviewsQueryQuery = {
  __typename?: 'Query';
  productReviews: { __typename?: 'ProductReviews' } & {
    ' $fragmentRefs'?: { ProductReviewsFragmentFragment: ProductReviewsFragmentFragment };
  };
};

export type ProductReviewFragmentFragment = {
  __typename?: 'Review';
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
} & { ' $fragmentName'?: 'ProductReviewFragmentFragment' };

export type ProductReviewsFragmentFragment = {
  __typename?: 'ProductReviews';
  productId: string;
  averageRating: number;
  totalCount: number;
  reviews: Array<
    { __typename?: 'Review'; id: string } & {
      ' $fragmentRefs'?: { ProductReviewFragmentFragment: ProductReviewFragmentFragment };
    }
  >;
} & { ' $fragmentName'?: 'ProductReviewsFragmentFragment' };

export type AddToCartMutationVariables = Exact<{
  input: AddToCartInput;
}>;

export type AddToCartMutation = {
  __typename?: 'Mutation';
  addToCart: {
    __typename?: 'AddToCartPayload';
    success: boolean;
    message?: string | null;
    cartItem?: {
      __typename?: 'CartItem';
      quantity: number;
      addedAt: string;
      product: {
        __typename?: 'Product';
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        stock: number;
        description?: string | null;
      };
    } | null;
  };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: {
    __typename?: 'LoginResponse';
    token: string;
    user: { __typename?: 'User'; id: string; email: string; name: string };
  };
};

export type ProductsQueryQueryVariables = Exact<{ [key: string]: never }>;

export type ProductsQueryQuery = {
  __typename?: 'Query';
  products: Array<
    { __typename?: 'Product'; id: string } & {
      ' $fragmentRefs'?: { ProductCardFragmentFragment: ProductCardFragmentFragment };
    }
  >;
};

export type GetProductQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetProductQueryQuery = {
  __typename?: 'Query';
  product?:
    | ({ __typename?: 'Product'; id: string; name: string } & {
        ' $fragmentRefs'?: { ProductDetailFragmentFragment: ProductDetailFragmentFragment };
      })
    | null;
};

export const ProductCardFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCardFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductCardFragmentFragment, unknown>;
export const ProductDetailFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductDetailFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductDetailFragmentFragment, unknown>;
export const ProductReviewFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductReviewFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Review' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rating' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductReviewFragmentFragment, unknown>;
export const ProductReviewsFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductReviewsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductReviews' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'productId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'averageRating' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'reviews' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProductReviewFragment' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductReviewFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Review' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rating' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductReviewsFragmentFragment, unknown>;
export const GetProductReviewsQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProductReviewsQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'productId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productReviews' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'productId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'productId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProductReviewsFragment' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductReviewFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Review' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rating' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductReviewsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductReviews' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'productId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'averageRating' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'reviews' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProductReviewFragment' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProductReviewsQueryQuery, GetProductReviewsQueryQueryVariables>;
export const AddToCartDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AddToCart' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'AddToCartInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addToCart' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'cartItem' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'product' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'addedAt' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddToCartMutation, AddToCartMutationVariables>;
export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'LoginInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const ProductsQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProductsQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'products' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProductCardFragment' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCardFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductsQueryQuery, ProductsQueryQueryVariables>;
export const GetProductQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProductQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'product' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProductDetailFragment' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductDetailFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProductQueryQuery, GetProductQueryQueryVariables>;
