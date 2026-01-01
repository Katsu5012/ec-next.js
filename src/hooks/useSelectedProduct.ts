import { useLocalStorage } from './useLocalStorage';
import { Product, SelectedProduct } from '../types';

/**
 * 購入数選択画面用のhook
 * 商品選択→購入数選択の一時的な状態を管理
 */
export function useSelectedProduct() {
  const [selectedProduct, setSelectedProduct] = useLocalStorage<SelectedProduct | null>(
    'ec-selected-product',
    null
  );

  /**
   * 商品を選択（商品一覧から遷移時）
   */
  const selectProduct = (product: Product, initialQuantity: number = 1) => {
    setSelectedProduct({
      product,
      quantity: initialQuantity,
    });
  };

  /**
   * 購入数を更新
   */
  const updateQuantity = (quantity: number) => {
    if (selectedProduct && quantity > 0 && quantity <= selectedProduct.product.stock) {
      setSelectedProduct({
        ...selectedProduct,
        quantity,
      });
    }
  };

  /**
   * 選択をクリア（カート追加後など）
   */
  const clearSelection = () => {
    setSelectedProduct(null);
  };

  /**
   * 購入数を増やす
   */
  const incrementQuantity = () => {
    if (selectedProduct && selectedProduct.quantity < selectedProduct.product.stock) {
      updateQuantity(selectedProduct.quantity + 1);
    }
  };

  /**
   * 購入数を減らす
   */
  const decrementQuantity = () => {
    if (selectedProduct && selectedProduct.quantity > 1) {
      updateQuantity(selectedProduct.quantity - 1);
    }
  };

  return {
    selectedProduct,
    selectProduct,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearSelection,
  };
}
