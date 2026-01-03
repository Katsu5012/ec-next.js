/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment ProductCardFragment on Product {\n    id\n    name\n    price\n    imageUrl\n    description\n    stock\n  }\n": typeof types.ProductCardFragmentFragmentDoc,
    "\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      success\n      message\n      cartItem {\n        product {\n          id\n          name\n          price\n          imageUrl\n          stock\n          description\n        }\n        quantity\n        addedAt\n      }\n    }\n  }\n": typeof types.AddToCartDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  query ProductsQuery {\n    products {\n      id\n      ...ProductCardFragment\n    }\n  }\n": typeof types.ProductsQueryDocument,
};
const documents: Documents = {
    "\n  fragment ProductCardFragment on Product {\n    id\n    name\n    price\n    imageUrl\n    description\n    stock\n  }\n": types.ProductCardFragmentFragmentDoc,
    "\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      success\n      message\n      cartItem {\n        product {\n          id\n          name\n          price\n          imageUrl\n          stock\n          description\n        }\n        quantity\n        addedAt\n      }\n    }\n  }\n": types.AddToCartDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  query ProductsQuery {\n    products {\n      id\n      ...ProductCardFragment\n    }\n  }\n": types.ProductsQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProductCardFragment on Product {\n    id\n    name\n    price\n    imageUrl\n    description\n    stock\n  }\n"): (typeof documents)["\n  fragment ProductCardFragment on Product {\n    id\n    name\n    price\n    imageUrl\n    description\n    stock\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      success\n      message\n      cartItem {\n        product {\n          id\n          name\n          price\n          imageUrl\n          stock\n          description\n        }\n        quantity\n        addedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      success\n      message\n      cartItem {\n        product {\n          id\n          name\n          price\n          imageUrl\n          stock\n          description\n        }\n        quantity\n        addedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductsQuery {\n    products {\n      id\n      ...ProductCardFragment\n    }\n  }\n"): (typeof documents)["\n  query ProductsQuery {\n    products {\n      id\n      ...ProductCardFragment\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;