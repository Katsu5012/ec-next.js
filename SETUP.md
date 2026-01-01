# セットアップガイド

このプロジェクトを初めて起動する際の詳細な手順です。

## 📋 前提条件

- Node.js 18以上（推奨: 20以上）
- npm または pnpm

### 使用している主要パッケージのバージョン

- **React 19.2** - 最新版
- **Next.js 16.1** - 最新版
- **Tailwind CSS 4.1** - 最新版（設定が大幅変更）
- **Storybook 10.1** - 最新版
- **Vitest 4.0** - 最新版
- **TypeScript 5.9** - 最新版

## 🚀 ステップバイステップ

### 1. リポジトリのクローン（または解凍）

```bash
# プロジェクトディレクトリに移動
cd ec-site-hooks
```

### 2. 依存関係のインストール

```bash
npm install
```

または pnpm を使用する場合：

```bash
pnpm install
```

### 3. MSW Service Workerの初期化（重要！）

**このステップは必須です。** MSWを使用するには、Service Workerファイルを生成する必要があります。

```bash
npm run msw:init
```

このコマンドは以下のファイルを生成します：
- `public/mockServiceWorker.js` - Next.js開発サーバー用
- `.storybook/public/mockServiceWorker.js` - Storybook用

**生成されるファイル**:
```
public/
└── mockServiceWorker.js         ← 生成される

.storybook/
└── public/
    └── mockServiceWorker.js     ← 生成される
```

### 4. 環境変数の設定（オプション）

`.env.local.example`をコピーして`.env.local`を作成：

```bash
cp .env.local.example .env.local
```

デフォルトの設定:
```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=/api/graphql
```

### 5. 開発サーバーの起動

#### Next.js開発サーバー

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

#### Storybook

```bash
npm run storybook
```

ブラウザで http://localhost:6006 を開きます。

## 🧪 テストの実行

```bash
# すべてのテストを実行
npm test

# UIモードで実行
npm run test:ui

# カバレッジレポート
npm run test:coverage
```

## 📝 GraphQL型生成（オプション）

GraphQLスキーマから型定義を生成：

```bash
npm run codegen
```

生成されるファイル:
```
src/graphql/generated/
├── graphql.ts
└── gql.ts
```

## ✅ 確認チェックリスト

セットアップが正しく完了したか確認：

- [ ] `npm install` が成功した
- [ ] `npm run msw:init` を実行した
- [ ] `public/mockServiceWorker.js` が存在する
- [ ] `.storybook/public/mockServiceWorker.js` が存在する
- [ ] `npm run dev` でNext.jsサーバーが起動する
- [ ] `npm run storybook` でStorybookが起動する
- [ ] `npm test` でテストが通る

## 🔍 トラブルシューティング

### エラー: "Service Worker script does not exist"

**原因**: MSW Service Workerが初期化されていません。

**解決方法**:
```bash
npm run msw:init
```

**確認**:
```bash
ls -la public/mockServiceWorker.js
ls -la .storybook/public/mockServiceWorker.js
```

両方のファイルが存在することを確認してください。

### エラー: "Cannot find module 'msw'"

**原因**: 依存関係がインストールされていません。

**解決方法**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### Storybookで画面が真っ白

**原因**: MSW Service Workerの初期化またはurql Providerの問題。

**解決方法**:
1. `npm run msw:init` を実行
2. ブラウザのキャッシュをクリア
3. Storybookを再起動

**Next.jsルーターのエラーが出る場合**:
Storybookのpreview.tsとストーリーファイルで適切にnextjsパラメータが設定されているか確認：

```typescript
// .storybook/preview.ts
parameters: {
  nextjs: {
    appDirectory: false,
    navigation: {
      pathname: '/',
    },
  },
}
```

### テストが通らない

**原因**: MSW serverが正しく起動していない可能性があります。

**確認**:
```bash
# テストのセットアップファイルを確認
cat src/test/setup.ts
```

以下が含まれていることを確認：
```typescript
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 📂 生成されるファイル/ディレクトリ

セットアップ後、以下のファイル/ディレクトリが生成されます：

```
node_modules/                    # 依存関係
.next/                          # Next.jsビルド出力
public/mockServiceWorker.js     # MSW Service Worker
.storybook/public/mockServiceWorker.js  # Storybook用MSW
storybook-static/               # Storybookビルド出力（build後）
coverage/                       # テストカバレッジ（test:coverage後）
src/graphql/generated/          # GraphQL型定義（codegen後）
```

## 🎉 完了

セットアップが完了しました！以下のコマンドで開発を開始できます：

```bash
# 開発サーバー
npm run dev

# Storybook
npm run storybook

# テスト
npm test
```

## 📝 Tailwind CSS 4への移行について

このプロジェクトはTailwind CSS 4を使用しています。主な変更点：

### PostCSS設定
```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // 新しいプラグイン
  },
};
```

### グローバルCSS
```css
/* src/styles/globals.css */
@import "tailwindcss"; /* 新しいインポート方法 */
```

### Tailwind設定ファイル
```typescript
// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ...
};
```

詳細は[Tailwind CSS 4ドキュメント](https://tailwindcss.com/blog/tailwindcss-v4-alpha)を参照してください。

Happy coding! 🚀
