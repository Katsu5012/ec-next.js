import type { FragmentType } from '@/gql';
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';

/**
 * テスト用のFragment型データを作成するヘルパー
 */
export function makeFragmentData<TType>(
  data: TType,
  _fragment: DocumentTypeDecoration<TType, unknown>
): FragmentType<DocumentTypeDecoration<TType, unknown>> {
  return data as FragmentType<DocumentTypeDecoration<TType, unknown>>;
}
