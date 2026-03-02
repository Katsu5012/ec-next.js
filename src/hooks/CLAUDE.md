# hooks/ ルール

## 作業前の必須手順

このディレクトリのファイルに触れる前に、以下のスキルルールを**全て読み込むこと**：

- `.agents/skills/vercel-react-best-practices/rules/*.md`
- `.agents/skills/vercel-composition-patterns/rules/*.md`

## Hooks設計パターン

このプロジェクトは3つのコアHooksで構成されている：

1. **useLocalStorage** - 汎用的なlocalStorage同期
2. **useSelectedProduct** - 購入数選択の一時状態（リロードで消える）
3. **useCart** - カート管理の永続状態（localStorageに保存）

新しいHooksを作成する際は、この設計パターンに従うこと。

## テスト必須

- Hooks `useXxx.ts` を新規作成する際は、**必ず同じディレクトリに `useXxx.test.ts` を作成すること**
