# ECサイト Hooks設計 - 設計サマリー

## 🎯 設計の要点

### 状態の分離戦略

このプロジェクトでは、**3層のhooks設計**を採用しています：

```
┌─────────────────────────────────────┐
│  useSelectedProduct (一時状態)      │  ← 購入数選択画面用
├─────────────────────────────────────┤
│  useCart (永続状態)                 │  ← カート全体の管理
├─────────────────────────────────────┤
│  useLocalStorage (基盤)             │  ← localStorage同期
└─────────────────────────────────────┘
```

## 📊 状態管理の比較表

| 項目 | useSelectedProduct | useCart |
|------|-------------------|---------|
| **保存先** | localStorage | localStorage |
| **キー** | `ec-selected-product` | `ec-cart-items` |
| **データ型** | `SelectedProduct \| null` | `CartItem[]` |
| **保持数** | 0〜1個 | 0〜N個 |
| **ライフサイクル** | 選択中のみ | 永続的 |
| **クリアタイミング** | カート追加時 | ユーザー操作 |
| **主な用途** | 購入数決定前の一時保持 | 購入予定商品の管理 |

## 🔑 設計判断の理由

### なぜ2つのhooksに分けるのか？

#### ❌ 1つのhooksにまとめた場合（アンチパターン）

```typescript
// 悪い例：すべてをuseCartで管理
const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // ...
};
```

**問題点：**
- 関心事が混在（一時状態 vs 永続状態）
- テストが困難
- 再利用性が低い
- 状態のライフサイクルが不明確

#### ✅ 分離した場合（推奨パターン）

```typescript
// 良い例：関心事ごとに分離
const useSelectedProduct = () => { /* 一時状態 */ };
const useCart = () => { /* 永続状態 */ };
```

**利点：**
- 単一責任の原則に従う
- 各hooksが独立してテスト可能
- 状態のライフサイクルが明確
- 再利用しやすい

## 🌊 データフローの詳細

### 1. 商品選択フェーズ

```typescript
// ProductList.tsx
const handleSelectProduct = (product: Product) => {
  selectProduct(product, 1);  // useSelectedProductに保存
  setCurrentPage('quantity');
};
```

**状態：**
```json
{
  "ec-selected-product": {
    "product": { "id": "1", "name": "商品A", ... },
    "quantity": 1
  }
}
```

### 2. 購入数調整フェーズ

```typescript
// QuantitySelection.tsx
const handleQuantityChange = (newQuantity: number) => {
  updateQuantity(newQuantity);  // useSelectedProductを更新
};
```

**状態：**
```json
{
  "ec-selected-product": {
    "product": { "id": "1", "name": "商品A", ... },
    "quantity": 3  // ← 更新された
  }
}
```

### 3. カート追加フェーズ

```typescript
// QuantitySelection.tsx
const handleAddToCart = () => {
  addToCart(product, quantity);  // useCartに追加
  clearSelection();              // useSelectedProductをクリア
  onComplete();
};
```

**状態変化：**
```json
// ec-selected-product: null (クリアされた)
// ec-cart-items:
[
  {
    "product": { "id": "1", "name": "商品A", ... },
    "quantity": 3,
    "addedAt": 1234567890
  }
]
```

## 💡 実装のベストプラクティス

### 1. useLocalStorageパターン

```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  // ✅ SSR対応（window存在チェック）
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    // localStorage読み込み
  });

  // ✅ 型安全な更新関数
  const setValue = (value: T | ((val: T) => T)) => {
    // 関数型更新にも対応
    const valueToStore = value instanceof Function 
      ? value(storedValue) 
      : value;
    // ...
  };

  return [storedValue, setValue] as const;  // ✅ as constで型推論を強化
}
```

### 2. カート重複管理パターン

```typescript
const addToCart = (product: Product, quantity: number) => {
  setCartItems((prevItems) => {
    // ✅ 既存商品チェック
    const existingItemIndex = prevItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      // ✅ 数量加算（在庫制限付き）
      const newItems = [...prevItems];
      const newQuantity = newItems[existingItemIndex].quantity + quantity;
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: Math.min(newQuantity, product.stock),
      };
      return newItems;
    }

    // ✅ 新規追加
    return [...prevItems, { product, quantity, addedAt: Date.now() }];
  });
};
```

### 3. 在庫制限パターン

```typescript
// ✅ 増減ボタンで在庫超過を防ぐ
const incrementQuantity = () => {
  if (selectedProduct && selectedProduct.quantity < selectedProduct.product.stock) {
    updateQuantity(selectedProduct.quantity + 1);
  }
};

// ✅ 直接入力でも在庫制限
const updateQuantity = (quantity: number) => {
  if (selectedProduct && quantity > 0 && quantity <= selectedProduct.product.stock) {
    setSelectedProduct({ ...selectedProduct, quantity });
  }
};
```

## 🧪 テストしやすい設計

各hooksは独立しているため、個別にテスト可能：

```typescript
// useSelectedProductのテスト例
describe('useSelectedProduct', () => {
  it('should select a product', () => {
    const { result } = renderHook(() => useSelectedProduct());
    act(() => {
      result.current.selectProduct(mockProduct, 1);
    });
    expect(result.current.selectedProduct).toEqual({
      product: mockProduct,
      quantity: 1,
    });
  });

  it('should clear selection', () => {
    const { result } = renderHook(() => useSelectedProduct());
    act(() => {
      result.current.selectProduct(mockProduct, 1);
      result.current.clearSelection();
    });
    expect(result.current.selectedProduct).toBeNull();
  });
});
```

## 🎨 UI設計の工夫

### 1. カート内商品数バッジ

```tsx
{totalItems > 0 && (
  <span className="absolute -top-1 -right-1 bg-red-600 text-white ...">
    {totalItems > 99 ? '99+' : totalItems}
  </span>
)}
```

### 2. ページフロー表示

```tsx
<span className={`px-3 py-1 rounded-full ${
  currentPage === 'products' 
    ? 'bg-blue-600 text-white' 
    : 'bg-gray-200 text-gray-600'
}`}>
  商品一覧
</span>
```

### 3. 在庫警告表示

```tsx
<button
  disabled={product.stock === 0}
  className={product.stock === 0 
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : 'bg-blue-600 text-white hover:bg-blue-700'
  }
>
  {product.stock === 0 ? '在庫切れ' : '購入数を選択'}
</button>
```

## 📈 スケーラビリティ

この設計は以下のように拡張可能：

### 新機能の追加例

```typescript
// 1. お気に入り機能
export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage<Product[]>('ec-wishlist', []);
  // ...
}

// 2. 最近見た商品
export function useRecentlyViewed() {
  const [items, setItems] = useLocalStorage<Product[]>('ec-recent', []);
  // ...
}

// 3. クーポン管理
export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('ec-coupons', []);
  // ...
}
```

## 🔒 型安全性

TypeScriptを活用した型安全な実装：

```typescript
// 型定義により、誤った使用を防ぐ
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

// ジェネリクスで再利用性を高める
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // ...
}
```

## 📝 まとめ

この設計の核心：

1. **関心の分離**: 一時状態（選択中）と永続状態（カート）を明確に分離
2. **単一責任**: 各hooksは1つの責務のみを持つ
3. **再利用性**: 汎用的なuseLocalStorageを基盤に
4. **型安全性**: TypeScriptで堅牢な実装
5. **テスタビリティ**: 各hookが独立してテスト可能

このパターンは、小〜中規模のECサイトに最適です。より大規模な場合は、Redux ToolkitやZustandの導入を検討してください。
