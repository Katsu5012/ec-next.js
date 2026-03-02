# pages/ ルール

## Pages Router

- **App Routerではない** - Pages Routerを使用すること
- App Routerのパターン（`app/` ディレクトリ、Server Components、`use client` 等）は使わないこと
- `_app.tsx` に urql Provider が設定済み
- ページ間の状態管理は localStorage または React Context を使用

## ルーティング

```
/          → index.tsx    → 商品一覧（GraphQL Query: GET_PRODUCTS）
/quantity  → quantity.tsx → 購入数選択（useSelectedProduct）
/cart      → cart.tsx     → カート（GraphQL Mutation: ADD_TO_CART, useCart）
```

## データフロー

```
商品一覧 → 商品選択 → 購入数選択 → カートに追加 → localStorage永続化
```
