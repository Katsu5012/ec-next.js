import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@/test/test-utils';
import { QuantitySelection } from './QuantitySelection';
import { mockProducts } from '@/data/products';
import userEvent from '@testing-library/user-event';

describe('QuantitySelection', () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // 選択された商品をセット
    localStorage.setItem(
      'ec-selected-product',
      JSON.stringify({
        product: mockProducts[0],
        quantity: 1,
      })
    );
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('ページタイトル「購入数の選択」が表示される', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByRole('heading', { name: '購入数の選択', level: 1 })).toBeInTheDocument();
  });

  it('選択された商品の情報が表示される', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const product = mockProducts[0];

    // 商品名（h2）
    expect(screen.getByRole('heading', { name: product.name, level: 2 })).toBeInTheDocument();

    // 価格表示（"/ 個"と一緒に表示されている箇所）
    const priceText = `¥${product.price.toLocaleString()}`;
    const priceElements = screen.getAllByText(priceText);
    expect(priceElements.length).toBeGreaterThan(0);

    // "/ 個"が隣接しているか確認
    expect(screen.getByText('/ 個')).toBeInTheDocument();

    // 在庫表示
    expect(screen.getByText(`在庫: ${product.stock}個`)).toBeInTheDocument();

    // 説明文（存在する場合）
    if (product.description) {
      expect(screen.getByText(product.description)).toBeInTheDocument();
    }
  });

  it('商品画像が表示される', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const product = mockProducts[0];
    const img = screen.getByAltText(product.name);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', product.imageUrl);
  });

  it('数量入力フィールドに初期値が表示される', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(1);
  });

  it('数量を増やすボタンで数量が増える', async () => {
    const user = userEvent.setup();
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const incrementButton = screen.getByRole('button', { name: '+' });
    const input = screen.getByRole('spinbutton');

    await user.click(incrementButton);

    expect(input).toHaveValue(2);
  });

  it('数量を減らすボタンで数量が減る', async () => {
    const user = userEvent.setup();

    // 初期数量を3に設定
    localStorage.clear();
    localStorage.setItem(
      'ec-selected-product',
      JSON.stringify({
        product: mockProducts[0],
        quantity: 3,
      })
    );

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const decrementButton = screen.getByRole('button', { name: '-' });
    const input = screen.getByRole('spinbutton');

    await user.click(decrementButton);

    expect(input).toHaveValue(2);
  });

  it('数量が1の時、減らすボタンが無効化される', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const decrementButton = screen.getByRole('button', { name: '-' });
    expect(decrementButton).toBeDisabled();
  });

  it('数量が在庫数と同じ時、増やすボタンが無効化される', () => {
    const product = mockProducts[0];

    localStorage.clear();
    localStorage.setItem(
      'ec-selected-product',
      JSON.stringify({
        product,
        quantity: product.stock,
      })
    );

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const incrementButton = screen.getByRole('button', { name: '+' });
    expect(incrementButton).toBeDisabled();
  });

  it('数量を直接入力できる', async () => {
    const user = userEvent.setup();
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const input = screen.getByRole('spinbutton');

    // インプットフィールドをダブルクリック（全選択）
    await user.dblClick(input);

    // 新しい値を入力
    await user.keyboard('5');

    expect(input).toHaveValue(5);
  });

  it('小計が正しく計算される', () => {
    localStorage.clear();
    localStorage.setItem(
      'ec-selected-product',
      JSON.stringify({
        product: mockProducts[0],
        quantity: 3,
      })
    );

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const product = mockProducts[0];
    const expectedTotal = product.price * 3;

    expect(screen.getByText(`¥${expectedTotal.toLocaleString()}`)).toBeInTheDocument();
  });

  it('「カートに追加」ボタンをクリックするとonCompleteが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const addButton = screen.getByRole('button', { name: 'カートに追加' });
    await user.click(addButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('「キャンセル」ボタンをクリックするとonCancelが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('カート追加後、選択された商品がクリアされカートに追加される', async () => {
    const user = userEvent.setup();
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const addButton = screen.getByRole('button', { name: 'カートに追加' });
    await user.click(addButton);

    // 選択された商品がクリアされる（キーが削除される）
    const selectedProduct = localStorage.getItem('ec-selected-product');
    expect(selectedProduct).toBeNull();

    // カートに追加されている
    const cartItems = localStorage.getItem('ec-cart-items');
    expect(cartItems).not.toBeNull();

    if (cartItems) {
      const parsed = JSON.parse(cartItems);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].product.id).toBe(mockProducts[0].id);
      expect(parsed[0].quantity).toBe(1);
    }
  });

  it('選択された商品がない場合、メッセージが表示される', () => {
    localStorage.clear();

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('商品が選択されていません')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '商品一覧に戻る' })).toBeInTheDocument();
  });

  it('商品が選択されていない場合、「商品一覧に戻る」ボタンでonCancelが呼ばれる', async () => {
    const user = userEvent.setup();
    localStorage.clear();

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const backButton = screen.getByRole('button', { name: '商品一覧に戻る' });
    await user.click(backButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('カートに既に同じ商品がある場合、カート内の状態が表示される', () => {
    // カートに同じ商品を追加
    const cartItems = [{ product: mockProducts[0], quantity: 2, addedAt: Date.now() }];
    localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('カート内の状態')).toBeInTheDocument();
    expect(screen.getByText(/この商品は既に.*2個.*カートに入っています/i)).toBeInTheDocument();
    expect(screen.getByText(/追加すると合計3個になります/i)).toBeInTheDocument();
  });

  it('カートに商品がある場合、追加後の合計金額が表示される', () => {
    const product = mockProducts[0];
    const cartItems = [{ product: product, quantity: 2, addedAt: Date.now() }];

    localStorage.clear();
    localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));
    localStorage.setItem(
      'ec-selected-product',
      JSON.stringify({
        product: product,
        quantity: 1,
      })
    );

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    // カート追加後の合計: (2 + 1) * price
    const expectedTotal = (2 + 1) * product.price;
    expect(screen.getByText('カート追加後の合計')).toBeInTheDocument();
    expect(screen.getByText(`¥${expectedTotal.toLocaleString()}`)).toBeInTheDocument();
  });

  it('ラベルが「購入数」と表示される（カートに商品がない場合）', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('購入数')).toBeInTheDocument();
  });

  it('ラベルが「追加する数量」と表示される（カートに商品がある場合）', () => {
    const cartItems = [{ product: mockProducts[0], quantity: 2, addedAt: Date.now() }];

    localStorage.clear();
    localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));
    localStorage.setItem(
      'ec-selected-product',
      JSON.stringify({
        product: mockProducts[0],
        quantity: 1,
      })
    );

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('追加する数量')).toBeInTheDocument();
  });

  it('小計のラベルが「小計」と表示される（カートに商品がない場合）', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('小計')).toBeInTheDocument();
  });

  it('小計のラベルが「追加分の小計」と表示される（カートに商品がある場合）', () => {
    const cartItems = [{ product: mockProducts[0], quantity: 2, addedAt: Date.now() }];

    localStorage.clear();
    localStorage.setItem('ec-cart-items', JSON.stringify(cartItems));
    localStorage.setItem(
      'ec-selected-product',
      JSON.stringify({
        product: mockProducts[0],
        quantity: 1,
      })
    );

    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('追加分の小計')).toBeInTheDocument();
  });

  it('最大数量のヘルプテキストが表示される', () => {
    render(<QuantitySelection onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const product = mockProducts[0];
    expect(screen.getByText(`最大 ${product.stock}個まで選択できます`)).toBeInTheDocument();
  });
});
