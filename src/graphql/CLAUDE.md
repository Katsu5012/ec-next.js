# graphql/ ルール

## スキーマ・クエリ変更時の必須コマンド

スキーマ（`schema.graphql`）やクエリ/ミューテーションを変更・追加した場合は、**必ず**型を再生成すること：

```bash
pnpm codegen
```

## ファイル配置

- `schema.graphql` - スキーマ定義
- `queries.ts` - クエリ定義
- `mutations.ts` - ミューテーション定義
- `src/gql/` - 自動生成ディレクトリ（手動編集禁止）

## Fragment Masking

- `codegen.ts` で Fragment Masking が有効
- `readFragment` 関数を使用してフラグメントデータを読み取ること

## MSWハンドラー

新しいクエリ/ミューテーションを追加した場合は `src/mocks/handlers.ts` にも対応するモックを追加すること。
