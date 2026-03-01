# ECサイト開発ガイド - Claude Code用

## プロジェクト概要

React 19 + TypeScript + Next.js 16 (Pages Router) + GraphQL (urql) + MSW + Vitest + Storybookで構築されたECサイト。
Hooks設計パターンを活用し、商品一覧→購入数選択→カートという単純明快なフローを実装。

## 重要: 作業開始前の必須チェック

### 1. MSW Service Workerの確認

このプロジェクトはMSWでGraphQL APIをモックしています。
以下のファイルが存在しない場合、**必ず**初期化を実行してください：

```bash
# 確認: 以下のファイルが存在するか
# - public/mockServiceWorker.js
# - .storybook/public/mockServiceWorker.js

# 存在しない場合は初期化
npm run msw:init
```

### 2. GraphQL型の生成

GraphQLスキーマから型定義を生成します。スキーマやクエリを変更した場合は必ず実行：

```bash
npm run codegen
```

## 技術スタック・バージョン

- **React 19** - 最新版、厳格な型チェック
- **TypeScript 5.9**
- **Tailwind CSS 4** - PostCSS設定が変更（`@tailwindcss/postcss`）
- **Next.js 16 (Pages Router)** - App Routerではない
- **GraphQL + urql 5** - データフェッチング
- **MSW 2** - APIモック（GraphQL対応）
- **Vitest 4** - テストフレームワーク
- **Storybook 10** - Next.js統合強化版

## ディレクトリ構造

```
pages/                          # Next.js Pages Router（App Routerではない）
├── _app.tsx                    # urql Provider設定あり
├── _document.tsx
├── index.tsx                   # 商品一覧（GraphQL Query使用）
├── quantity.tsx                # 購入数選択
└── cart.tsx                    # カート

src/
├── graphql/
│   ├── schema.graphql          # GraphQLスキーマ定義
│   ├── queries.ts              # GraphQLクエリ
│   └── mutations.ts            # GraphQLミューテーション
├── mocks/
│   ├── handlers.ts             # MSWハンドラー（テスト・Storybookで共有）
│   ├── server.ts               # Node用MSW
│   └── browser.ts              # ブラウザ用MSW
├── lib/
│   └── urql.ts                 # urqlクライアント設定
├── hooks/                      # カスタムHooks + テスト
│   ├── useLocalStorage.ts      # localStorage同期
│   ├── useSelectedProduct.ts   # 購入数選択の一時状態
│   └── useCart.ts              # カート管理の永続状態
├── components/                 # UIコンポーネント + テスト + ストーリー
├── types/
├── data/
└── test/
    ├── setup.ts                # テスト設定（MSW統合済み）
    └── test-utils.tsx          # テストヘルパー

.storybook/
├── main.ts
└── preview.ts                  # MSW統合、Next.js設定
```

## コマンド

```bash
# 開発
npm run dev                     # http://localhost:3000
npm run storybook               # http://localhost:6006

# テスト
npm test                        # Vitest実行
npm run test:ui                 # UIモード
npm run test:coverage           # カバレッジ

# GraphQL
npm run codegen                 # スキーマから型生成

# MSW
npm run msw:init                # Service Worker初期化（初回のみ）

# ビルド
npm run build
```

## コーディング規約

### GraphQL

#### クエリ・ミューテーション

- `src/graphql/queries.ts` または `src/graphql/mutations.ts` に定義
- 型安全性のため、必ず `npm run codegen` で型を生成
- urqlの `useQuery` と `useMutation` を使用

```typescript
// 良い例
const [result] = useQuery({ query: GET_PRODUCTS });
const { data, fetching, error } = result;

const [, addToCart] = useMutation(ADD_TO_CART_MUTATION);
await addToCart({ input: { productId, quantity } });
```

#### Fragment Masking

- `codegen.ts` で Fragment Masking が有効化されています
- `readFragment` 関数を使用してフラグメントデータを読み取る

### Hooks設計

このプロジェクトは3つのコアHooksで構成：

1. **useLocalStorage** - 汎用的なlocalStorage同期
2. **useSelectedProduct** - 購入数選択の一時状態（リロードで消える）
3. **useCart** - カート管理の永続状態（localStorageに保存）

新しいHooksを作成する際は、この設計パターンに従ってください。

### Next.js Pages Router

- **App Routerではありません** - Pages Routerを使用
- `pages/_app.tsx` に urql Provider が設定済み
- ページ間の状態管理はlocalStorageまたはReact Contextを使用

### MSWモック

- テストとStorybookで**同じハンドラーを共有**
- `src/mocks/handlers.ts` にGraphQLモックを定義
- テスト: `src/test/setup.ts` で自動セットアップ済み
- Storybook: `.storybook/preview.ts` で自動セットアップ済み

```typescript
// src/mocks/handlers.ts
graphql.query('GetProducts', () => {
  return HttpResponse.json({
    data: { products: mockProducts },
  });
});
```

### テスト

- すべてのコンポーネント・Hooksにテストを書く
- urql Providerでラップする（`test-utils.tsx` のヘルパーを使用）
- MSWは `src/test/setup.ts` で自動セットアップ済み
- localStorageは各テスト前後に自動クリア

### Storybook

- すべてのUIコンポーネントにストーリーを作成
- MSWで各種状態（通常、エラー、ローディング）をモック
- urql Providerでラップする
- Next.jsのrouterモックは `.storybook/preview.ts` で設定済み

### TypeScript

- strict モード有効
- `any` の使用は避ける
- GraphQL型は自動生成されたものを使用（`src/gql/` 配下）

### スタイリング

- Tailwind CSS 4 を使用
- インラインクラスで記述
- コンポーネントの再利用性を考慮

## よくある問題と解決方法

### "Service Worker script does not exist" エラー

**原因**: MSW Service Workerが初期化されていない  
**解決**: `npm run msw:init`

### GraphQLクエリの型が見つからない

**原因**: 型が生成されていない  
**解決**: `npm run codegen`

### Storybookでコンポーネントがレンダリングされない

**原因**: Next.jsのrouterモックの問題  
**解決**: `.storybook/preview.ts` の設定を確認、Storybookを再起動

### テストで "fetch is not defined" エラー

**原因**: Node.js 18未満を使用している  
**解決**: Node.js 18以上にアップグレード

## 作業時の注意点

1. **GraphQLスキーマを変更したら必ず `npm run codegen`**
2. **新しいクエリ/ミューテーションを追加したら必ず `npm run codegen`**
3. **MSW Service Workerファイルは Git にコミットしない**（`.gitignore` に追加済み）
4. **Pages Router使用** - App Routerのパターンを使わないこと
5. **localStorage の状態管理** - カートと選択商品は永続化される仕様

## データフロー

```
商品一覧（index.tsx）
  ↓ GraphQL Query: GET_PRODUCTS
  ↓ 商品選択
購入数選択（quantity.tsx）
  ↓ useSelectedProduct（一時状態）
  ↓ 購入数入力
カート（cart.tsx）
  ↓ GraphQL Mutation: ADD_TO_CART
  ↓ useCart（永続状態）
  └→ localStorage同期
```

## 参考リソース

- スキーマ定義: `src/graphql/schema.graphql`
- MSWハンドラー: `src/mocks/handlers.ts`
- urql設定: `src/lib/urql.ts`
- テスト設定: `src/test/setup.ts`
- Storybook設定: `.storybook/preview.ts`
