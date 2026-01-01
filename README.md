# ECサイト Hooks設計

React + TypeScript + Tailwind CSS + **Next.js Pages Router** + **GraphQL (urql)** + **MSW** + Vitest + Storybookで実装したECサイトのサンプルです。

## 📋 フロー

```
商品一覧 → 購入数選択 → カート
```

- 商品選択時、必ず購入数選択画面を経由
- 選択した商品はlocalStorageに保持され、リロードしても復元される
- カート内の商品も永続化される
- カート内に既存商品がある場合、その情報を表示
- **GraphQLで商品データを取得**
- **MSWでGraphQLモックサーバーを実装**

## 🚀 クイックスタート

```bash
# 1. 依存関係のインストール
npm install

# 2. MSW Service Workerの初期化（初回のみ・重要！）
npm run msw:init

# 3. 開発サーバー起動（http://localhost:3000）
npm run dev

# 4. Storybook起動（http://localhost:6006）
npm run storybook

# 5. テスト実行
npm test

# 6. テストUIで実行
npm run test:ui

# 7. GraphQL型生成
npm run codegen
```

## 🛠️ 技術スタック

- **React 19** - UIライブラリ（最新版）
- **TypeScript 5.9** - 型安全性
- **Tailwind CSS 4** - スタイリング（最新版）
- **Next.js 16 (Pages Router)** - Reactフレームワーク（最新版）
- **GraphQL + urql 5** - データフェッチング
- **MSW 2** - APIモック
- **Vitest 4** - テストフレームワーク（最新版）
- **Storybook 10** - コンポーネントカタログ（最新版）

## ⚙️ 初回セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. MSW Service Workerの初期化（必須）

**重要**: MSWを使用するには、Service Workerファイルを生成する必要があります。

```bash
npm run msw:init
```

このコマンドは以下の2つのディレクトリにService Workerを生成します：
- `public/mockServiceWorker.js` - Next.js用
- `.storybook/public/mockServiceWorker.js` - Storybook用

**注意**: このステップをスキップすると、StorybookとテストでMSWが動作しません。

### 3. 開発サーバー起動

```bash
# Next.js開発サーバー
npm run dev

# Storybook
npm run storybook
```

## 🎯 アーキテクチャ

### Hooks設計

1. **useLocalStorage** - localStorage同期
2. **useSelectedProduct** - 購入数選択の一時状態
3. **useCart** - カート管理の永続状態

### GraphQL統合

#### クエリ例
```typescript
const [result] = useQuery({ query: GET_PRODUCTS });
const { data, fetching, error } = result;
```

#### ミューテーション例
```typescript
const [, addToCart] = useMutation(ADD_TO_CART_MUTATION);
await addToCart({ input: { productId, quantity } });
```

### MSWモック

テストとStorybookで同じモックハンドラーを共有：

```typescript
// src/mocks/handlers.ts
graphql.query('GetProducts', () => {
  return HttpResponse.json({
    data: { products: mockProducts },
  });
});
```

## 📁 ディレクトリ構成

```
├── pages/                       # Next.js Pages Router
│   ├── _app.tsx                # urql Provider設定
│   ├── _document.tsx           # HTML構造
│   ├── index.tsx               # 商品一覧（GraphQL Query）
│   ├── quantity.tsx            # 購入数選択
│   └── cart.tsx                # カート
├── src/
│   ├── graphql/
│   │   ├── schema.graphql      # GraphQLスキーマ
│   │   ├── queries.ts          # GraphQLクエリ
│   │   └── mutations.ts        # GraphQLミューテーション
│   ├── mocks/
│   │   ├── handlers.ts         # MSWハンドラー
│   │   ├── server.ts           # Node用MSW（テスト）
│   │   └── browser.ts          # ブラウザ用MSW（Storybook）
│   ├── lib/
│   │   └── urql.ts            # urqlクライアント設定
│   ├── hooks/                  # カスタムHooks + テスト
│   ├── components/             # UIコンポーネント + テスト + ストーリー
│   ├── types/
│   ├── data/
│   └── test/
│       ├── setup.ts            # テスト設定（MSW統合）
│       └── test-utils.tsx      # テストヘルパー
├── .storybook/
│   ├── main.ts
│   └── preview.ts              # MSW統合
└── codegen.ts                  # GraphQL Codegen設定
```

## 🔌 GraphQL + MSW統合

### 1. テストでのMSW使用

```typescript
// src/test/setup.ts
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. StorybookでのMSW使用

```typescript
// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '../src/mocks/handlers';

initialize();

export default {
  parameters: {
    msw: { handlers },
  },
  loaders: [mswLoader],
};
```

### 3. urql Provider

すべてのテストとStorybookストーリーでurql Providerでラップ：

```typescript
import { Provider as UrqlProvider } from 'urql';
import { createUrqlClient } from '../lib/urql';

const urqlClient = createUrqlClient();

<UrqlProvider value={urqlClient}>
  <Component />
</UrqlProvider>
```

## 🗺️ Next.js Pages Router

```
/                 → 商品一覧（GraphQL Query）
/quantity         → 購入数選択
/cart             → カート
```

## 🧪 テスト

```bash
npm test              # テスト実行
npm run test:ui       # UIモード
npm run test:coverage # カバレッジ
```

- **MSW統合** - GraphQL APIをモック
- **urql Provider** - すべてのテストでurqlクライアント提供
- **localStorage** - 各テスト前後にクリア

## 📖 Storybook

```bash
npm run storybook
```

- **MSW統合** - GraphQLレスポンスをモック
- **urql Provider** - すべてのストーリーでurqlクライアント提供
- **各種状態** - 通常、エラー、ローディングなど

## 🎓 学べるポイント

1. ✅ Custom Hooksの設計パターン
2. ✅ GraphQL + urqlの実装
3. ✅ MSWによるAPIモック戦略
4. ✅ Next.js Pages Routerの活用
5. ✅ テストとStorybookでのMSW共有
6. ✅ TypeScript型安全なGraphQL

## 📚 参考リソース

- [Next.js Pages Router](https://nextjs.org/docs/pages)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [urql Documentation](https://formidable.com/open-source/urql/)
- [MSW Documentation](https://mswjs.io/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Vitest](https://vitest.dev/)
- [Storybook](https://storybook.js.org/)

## 📝 バージョン情報

### 主要な変更点

#### Tailwind CSS 4
- PostCSS設定が変更: `@tailwindcss/postcss`プラグインを使用
- 設定ファイルがTypeScriptに対応

#### React 19
- 最新のReact機能に対応
- より厳格な型チェック

#### Next.js 16
- Pages Routerの安定版
- パフォーマンス最適化

#### Storybook 10
- 最新のUI/UX改善
- Next.jsとの統合強化

## 🔧 トラブルシューティング

### Storybookで "Service Worker script does not exist" エラーが出る

**原因**: MSW Service Workerが初期化されていません。

**解決方法**:
```bash
npm run msw:init
```

このコマンドで`public/mockServiceWorker.js`と`.storybook/public/mockServiceWorker.js`が生成されます。

### Storybookでコンポーネントがレンダリングされない

**原因**: Next.jsのrouterが正しく設定されていない可能性があります。

**解決方法**: 
1. `@storybook/nextjs`がインストールされているか確認
2. `.storybook/preview.ts`に以下が設定されているか確認：

```typescript
parameters: {
  nextjs: {
    appDirectory: false,
    navigation: {
      pathname: '/',
    },
  },
}
```

3. Storybookを再起動

### テストで "fetch is not defined" エラーが出る

**原因**: Node.js環境でfetchが使えない可能性があります。

**解決方法**: Node.js 18以上を使用してください。または`node-fetch`をインストールしてください。

### GraphQLクエリの型が生成されない

**解決方法**:
```bash
npm run codegen
```

GraphQLスキーマから型定義を生成します。
