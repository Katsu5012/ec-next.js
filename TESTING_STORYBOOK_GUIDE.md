# テスト・Storybook・Next.js ガイド

## 🧪 Vitest - テスト実行ガイド

### 基本コマンド

```bash
# すべてのテストを実行
pnpm test

# ウォッチモードで実行
pnpm test -- --watch

# UIモードで実行（推奨）
pnpm test:ui

# カバレッジレポート生成
pnpm test:coverage

# 特定のファイルのみテスト
pnpm test useCart.test.ts

# 特定のテストケースのみ実行
pnpm test -- -t "商品をカートに追加"
```

### テストの書き方

#### Hooksのテスト例

```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCart } from '../useCart';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('商品をカートに追加できるべき', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
  });
});
```

#### コンポーネントのテスト例

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Cart } from './Cart';

describe('Cart', () => {
  it('空のカートでは空メッセージが表示される', () => {
    render(<Cart onContinueShopping={() => {}} />);

    expect(screen.getByText('カートが空です')).toBeInTheDocument();
  });

  it('ボタンをクリックするとコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();

    render(<Cart onContinueShopping={mockCallback} />);

    await user.click(screen.getByText('買い物を続ける'));

    expect(mockCallback).toHaveBeenCalled();
  });
});
```

### テストのベストプラクティス

1. **各テストの独立性を保つ**
   - `beforeEach`で状態をクリア
   - localStorageのクリーンアップ

2. **わかりやすいテスト名**
   - 「〜できるべき」「〜であるべき」形式

3. **AAA パターン**
   - Arrange (準備)
   - Act (実行)
   - Assert (検証)

4. **エッジケースのテスト**
   - 在庫制限
   - 数量制限
   - 空の状態

### テストカバレッジの確認

```bash
pnpm test:coverage
```

生成されたレポートは `coverage/index.html` で確認できます。

---

## 📖 Storybook - コンポーネントカタログ

### 基本コマンド

```bash
# Storybookを起動
pnpm storybook

# 静的ビルド
pnpm build-storybook
```

起動後、http://localhost:6006 でコンポーネントカタログが開きます。

### Storyの書き方

#### 基本的なStory

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ProductList } from './ProductList';
import { mockProducts } from '../data/products';

const meta = {
  title: 'Components/ProductList',
  component: ProductList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    products: mockProducts,
  },
};

export const EmptyList: Story = {
  args: {
    products: [],
  },
};
```

#### Hooksを使用するStory

```typescript
export const WithCartItems: Story = {
  render: () => {
    const { addToCart, clearCart } = useCart();

    useEffect(() => {
      clearCart();
      addToCart(mockProducts[0], 2);
    }, []);

    return <Cart onContinueShopping={() => {}} />;
  },
};
```

### Storybookの活用方法

1. **コンポーネントの状態を確認**
   - 通常状態
   - エラー状態
   - ローディング状態
   - 空の状態

2. **インタラクションのテスト**
   - ボタンのクリック
   - フォーム入力
   - 状態の変化

3. **レスポンシブデザインの確認**
   - Storybookのビューポート変更機能を使用

4. **アクセシビリティの確認**
   - a11y アドオンを使用

---

## 🗺️ Next.js App Router - ルーティングガイド

### ファイルベースのルーティング

```
app/
├── layout.tsx       # ルートレイアウト（全ページ共通）
├── page.tsx         # / (商品一覧)
├── quantity/
│   └── page.tsx     # /quantity (購入数選択)
└── cart/
    └── page.tsx     # /cart (カート)
```

### ページの定義

#### ルートレイアウト (`app/layout.tsx`)

```typescript
import { Header } from '@/components/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

#### ページコンポーネント (`app/page.tsx`)

```typescript
import { ProductList } from '@/components/ProductList'

export default function Home() {
  return <ProductList products={mockProducts} />
}
```

#### クライアントコンポーネント (`app/quantity/page.tsx`)

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function QuantityPage() {
  const router = useRouter()

  return (
    <QuantitySelection
      onComplete={() => router.push('/cart')}
      onCancel={() => router.push('/')}
    />
  )
}
```

### ナビゲーション

#### Linkコンポーネントを使用

```typescript
import Link from 'next/link'

<Link href="/cart" className="...">
  カートへ
</Link>
```

#### プログラマティックなナビゲーション

```typescript
'use client'

import { useRouter } from 'next/navigation'

function MyComponent() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/cart')
  }

  return <button onClick={handleClick}>カートへ</button>
}
```

### Server ComponentsとClient Components

#### Server Components（デフォルト）

- サーバーサイドでレンダリング
- バンドルサイズが小さい
- データフェッチが高速
- `'use client'`が**ない**

```typescript
// app/page.tsx - Server Component
export default function Home() {
  return <ProductList products={mockProducts} />
}
```

#### Client Components

- クライアントサイドでレンダリング
- インタラクティブ（useState、useEffectなど使用可）
- `'use client'`ディレクティブが**必要**

```typescript
'use client'

import { useState } from 'react'

export function MyComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### パスエイリアス

`tsconfig.json`で`@/`エイリアスを設定：

```typescript
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
```

---

## 🔧 開発ワークフロー

### 1. 新しい機能の開発

```bash
# 1. 新しいコンポーネントを作成
touch src/components/NewComponent.tsx

# 2. Storyを作成して視覚的に確認
touch src/components/NewComponent.stories.tsx
pnpm storybook

# 3. テストを作成
touch src/components/NewComponent.test.tsx
pnpm test -- --watch

# 4. 実装とテストを繰り返す
```

### 2. テスト駆動開発（TDD）

```bash
# 1. テストを先に書く
# src/hooks/useNewHook.test.ts を作成

# 2. テストを実行（失敗することを確認）
pnpm test

# 3. 実装する
# src/hooks/useNewHook.ts を作成

# 4. テストをパス
pnpm test

# 5. リファクタリング
```

### 3. コンポーネントのドキュメント化

```bash
# 1. Storybookでコンポーネントを開発
pnpm storybook

# 2. さまざまな状態のStoryを追加
# - Default
# - Loading
# - Error
# - Empty

# 3. インタラクションを追加

# 4. ドキュメントを自動生成
# tags: ['autodocs'] を設定
```

---

## 📊 CI/CD での活用

### GitHub Actions の例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm ci
      - run: pnpm test
      - run: pnpm build-storybook
```

---

## 🎯 まとめ

### Vitestの利点

- ✅ 高速なテスト実行
- ✅ Viteとの統合
- ✅ Hot Module Replacement対応
- ✅ UIモードで視覚的にテスト確認

### Storybookの利点

- ✅ コンポーネントの独立した開発
- ✅ 視覚的なドキュメント
- ✅ さまざまな状態の確認が容易
- ✅ デザイナーとの協業が容易

### Next.js App Routerの利点

- ✅ ファイルベースの直感的なルーティング
- ✅ Server ComponentsとClient Componentsの使い分け
- ✅ 組み込みの最適化機能
- ✅ 高速なFast Refresh
- ✅ 本番環境に最適化されたビルド

これらのツールを組み合わせることで、保守性が高く、品質の高いアプリケーションを開発できます。
