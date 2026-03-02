# components/ ルール

## 作業前の必須手順

このディレクトリのファイルに触れる前に、以下のスキルルールを**全て読み込むこと**：

- `.agents/skills/vercel-react-best-practices/rules/*.md`
- `.agents/skills/vercel-composition-patterns/rules/*.md`

## コンポーネント作成ルール

- コンポーネント `ComponentName.tsx` を新規作成する際は、**必ず同じディレクトリに以下を作成すること**：
  - `ComponentName.test.tsx` （テスト）
  - `ComponentName.stories.tsx` （Storybook）
- テストは `@/test/test-utils` から `render` をインポート（urqlProvider込み）
- `userEvent.setup()` を使用（`fireEvent` は使わない）
- ストーリーは `satisfies Meta<typeof ComponentName>` と `tags: ['autodocs']` を必ず含める
- 最低3つのストーリー（デフォルト・データあり・空/エラー）を作成

## スタイリング

- Tailwind CSS 4 のインラインクラスで記述
