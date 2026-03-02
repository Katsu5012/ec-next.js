# プロジェクト ディレクトリ構成ルール

このプロジェクトは以下のディレクトリ構成に従う。ファイルの新規作成・移動時は必ずこの構成を守ること。

**注意: ページファイルは `src/pages/` に配置する。ルート直下に `pages/` ディレクトリを作成してはならない（Next.jsが `src/pages/` を無視してしまうため）。**

```
src/
├── pages/                      # Next.js Pages Router（App Routerではない）
│   ├── _app.tsx                # urql Provider設定
│   ├── _document.tsx           # HTML構造
│   ├── index.tsx               # 商品一覧（GraphQL Query）
│   ├── quantity.tsx            # 購入数選択
│   └── cart.tsx                # カート
├──
├── graphql/                    # GraphQL関連（スキーマ・クエリ・ミューテーション）
│   ├── schema.graphql          # スキーマ定義（変更後は pnpm codegen 必須）
│   ├── queries.ts              # クエリ定義
│   └── mutations.ts            # ミューテーション定義
├── gql/                        # GraphQL Codegen自動生成（手動編集禁止）
├── mocks/                      # MSWモックハンドラー（テスト・Storybook共有）
│   ├── handlers.ts             # ハンドラー定義
│   ├── server.ts               # Node用（テスト）
│   └── browser.ts              # ブラウザ用（Storybook）
├── lib/                        # ライブラリ設定（urql等）
├── hooks/                      # カスタムHooks + テスト
├── components/                 # UIコンポーネント + テスト + ストーリー
├── types/                      # 型定義
├── data/                       # 静的データ
├── utils/                      # ユーティリティ関数
├── styles/                     # スタイル
└── test/                       # テスト設定・ヘルパー

.storybook/                     # Storybook設定
.agents/skills/                 # スキルルール（後述の必読ルール）
```

## 配置ルール

- ページコンポーネント → `src/pages/`（ルート直下の `pages/` に置かないこと）
- 再利用可能なUIコンポーネント → `src/components/`
- カスタムHooks → `src/hooks/`
- GraphQLクエリ/ミューテーション → `src/graphql/`
- MSWハンドラー追加 → `src/mocks/handlers.ts`
- `src/gql/` は自動生成ディレクトリのため手動で編集してはならない
