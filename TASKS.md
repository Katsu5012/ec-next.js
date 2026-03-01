# EC サイト 実装タスク一覧

## 優先度: 高（購入フロー完成）

### TASK-001: チェックアウトページの実装

**ゴール**: カートの「購入手続きへ」ボタンで遷移できる購入フローを完成させる

**作業内容**:

1. GraphQLスキーマに `Order` / `ShippingAddress` / `PlaceOrder` mutation を追加 (`src/graphql/schema.graphql`)
2. `npm run codegen` で型を生成
3. MSWハンドラーに `placeOrder` mutation を追加 (`src/mocks/handlers.ts`)
4. `pages/checkout.tsx` を作成（配送先住所フォーム + 注文確認）
5. `src/components/Checkout/Checkout.tsx` を作成
   - react-hook-form + zod でフォームバリデーション（ログインページと同じパターン）
   - 氏名・郵便番号・住所・電話番号のフィールド
   - 注文内容サマリー表示（カートアイテム・合計金額）
6. `pages/order-complete.tsx` を作成（注文完了ページ）
7. `Cart.tsx` の `alert('購入処理は未実装です')` を `router.push('/checkout')` に変更
8. `Header.tsx` のページインジケーターに「購入手続き」ステップを追加
9. 注文後 `clearCart()` を実行

**参照ファイル**:

- `src/components/Login/Login.tsx` （フォームパターンの参考）
- `src/hooks/useCart.ts` （clearCart の使い方）
- `src/graphql/schema.graphql` （スキーマ追加箇所）

---

### TASK-002: 注文履歴ページの実装

**ゴール**: ユーザーが過去の注文を確認できるマイページを追加する

**作業内容**:

1. GraphQLスキーマに `Order` 型と `orders` クエリを追加
2. `npm run codegen` で型を生成
3. MSWハンドラーに `GetOrdersQuery` を追加（モックデータ作成）
4. `src/data/orders.ts` にモック注文データを作成
5. `pages/orders.tsx` を作成（AuthGuard で保護）
6. `src/components/OrderHistory/OrderHistory.tsx` を作成
   - 注文日・注文番号・商品リスト・合計金額・ステータス表示
7. `Header.tsx` またはマイページリンクから遷移できるようにする

---

### TASK-003: レビュー投稿機能の実装

**ゴール**: 商品詳細ページでレビューを投稿できるようにする

**作業内容**:

1. GraphQLスキーマに `createReview` mutation を追加 (`src/graphql/schema.graphql`)
2. `npm run codegen` で型を生成
3. MSWハンドラーに `CreateReview` mutation を追加
4. `src/components/ProductReviews.tsx` に投稿フォームを追加
   - 星評価セレクター（1〜5）
   - コメントテキストエリア
   - 送信ボタン（urql useMutation 使用）
   - 送信後にレビューリストを再取得（onRefresh を呼ぶ）
5. バリデーション: コメント必須・評価必須

**参照ファイル**:

- `src/components/ProductReviews.tsx` （既存レビュー表示の実装場所）
- `src/mocks/handlers.ts` （ハンドラー追加パターン）

---

## 優先度: 中（UX改善）

### TASK-004: 商品検索・フィルター機能

**ゴール**: 商品一覧でキーワード検索・価格フィルター・並び替えができるようにする

**作業内容**:

1. `pages/index.tsx` に検索フォームと絞り込みUIを追加
2. `src/components/ProductFilter/ProductFilter.tsx` を作成
   - キーワード入力フォーム
   - 価格帯スライダーまたは入力
   - 並び順セレクター（価格昇順・降順・新着）
3. フィルタリングはクライアントサイドで実装（MSW返却データをフロントでフィルタ）
4. `useProductFilter` hookを作成して状態管理

---

### TASK-005: マイページ（アカウント管理）

**ゴール**: ログインユーザーが自分の情報を確認できるページを追加

**作業内容**:

1. `pages/mypage.tsx` を作成（AuthGuard で保護）
2. ユーザー情報表示（名前・メール）
3. 注文履歴へのリンク（TASK-002と連携）
4. `Header.tsx` のユーザー名をマイページへのリンクに変更

---

## 完了済み

- [x] 商品一覧・詳細表示
- [x] カート管理（追加・削除・数量変更）
- [x] 購入数選択ページ
- [x] ログイン・認証（AuthGuard）
- [x] レビュー表示
- [x] rendering-conditional-render 違反修正 (&&→ternary)
- [x] rendering-hoist-jsx 違反修正（静的SVGの定数化）
- [x] GitHub Actions ワークフロー追加 (.github/workflows/claude-review.yml)
