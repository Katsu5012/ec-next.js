import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, within } from "@/test/test-utils";
import { Cart } from "./Cart";
import { mockProducts } from "@/data/products";
import userEvent from "@testing-library/user-event";

describe("Cart", () => {
  const mockOnContinueShopping = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("空のカートの場合、メッセージが表示される", () => {
    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    // 実際の文言に合わせる
    expect(screen.getByText("カートが空です")).toBeInTheDocument();
    expect(screen.getByText("商品を追加してください")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "買い物を続ける" })
    ).toBeInTheDocument();
  });

  it("カート内の商品が正しく表示される", () => {
    const cartItems = [
      { product: mockProducts[0], quantity: 2, addedAt: Date.now() },
      { product: mockProducts[1], quantity: 1, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    // 各商品の情報を検証
    cartItems.forEach(({ product, quantity }) => {
      // 商品名（h3タグ）
      expect(
        screen.getByRole("heading", { name: product.name, level: 3 })
      ).toBeInTheDocument();

      // 単価表示
      expect(
        screen.getByText(`¥${product.price.toLocaleString()} / 個`)
      ).toBeInTheDocument();

      // 在庫表示
      expect(screen.getByText(`在庫: ${product.stock}個`)).toBeInTheDocument();

      // 数量（数字のみ、"数量:"接頭辞なし）
      const quantityElements = screen.getAllByText(quantity.toString());
      expect(quantityElements.length).toBeGreaterThan(0);

      // 小計
      const subtotal = product.price * quantity;
      expect(
        screen.getByText(`¥${subtotal.toLocaleString()}`)
      ).toBeInTheDocument();
    });
  });

  it("ヘッダーに「ショッピングカート」と表示される", () => {
    const cartItems = [
      { product: mockProducts[0], quantity: 1, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    expect(
      screen.getByRole("heading", { name: "ショッピングカート", level: 1 })
    ).toBeInTheDocument();
  });

  it("合計金額と商品数が正しく表示される", () => {
    const cartItems = [
      { product: mockProducts[0], quantity: 2, addedAt: Date.now() },
      { product: mockProducts[1], quantity: 1, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    // 商品数
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    expect(screen.getByText(`${totalItems}個`)).toBeInTheDocument();

    // 合計金額
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    expect(
      screen.getByText(`合計金額 ¥${total.toLocaleString()}`)
    ).toBeInTheDocument();
  });

  it("削除ボタンで商品が削除される", async () => {
    const user = userEvent.setup();
    const cartItems = [
      { product: mockProducts[0], quantity: 2, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    // aria-labelで削除ボタンを取得
    const deleteButton = screen.getByRole("button", { name: "削除" });
    await user.click(deleteButton);

    // 商品が削除されたことを確認
    expect(screen.queryByText(mockProducts[0].name)).not.toBeInTheDocument();

    // 空のカートメッセージが表示される（正しい文言）
    expect(screen.getByText("カートが空です")).toBeInTheDocument();
  });

  it("「カートを空にする」ボタンで全商品が削除される", async () => {
    const user = userEvent.setup();
    const cartItems = [
      { product: mockProducts[0], quantity: 2, addedAt: Date.now() },
      { product: mockProducts[1], quantity: 1, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    const clearButton = screen.getByRole("button", {
      name: "カートを空にする",
    });
    await user.click(clearButton);

    // 全商品が削除される
    expect(screen.queryByText(mockProducts[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockProducts[1].name)).not.toBeInTheDocument();
    expect(screen.getByText("カートが空です")).toBeInTheDocument();
  });

  it("数量を増やすボタンで数量が増える", async () => {
    const user = userEvent.setup();
    const cartItems = [
      { product: mockProducts[0], quantity: 2, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    // 現在の数量を確認（複数の"2"があるので、数量調整エリアのものを特定）
    const quantityArea = screen.getByText("2").closest("div");
    expect(quantityArea).toHaveTextContent("2");

    // +ボタンをクリック
    const incrementButton = screen.getByRole("button", { name: "+" });
    await user.click(incrementButton);

    // 数量が3になる
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("数量を減らすボタンで数量が減る", async () => {
    const user = userEvent.setup();
    const cartItems = [
      { product: mockProducts[0], quantity: 3, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    // -ボタンをクリック
    const decrementButton = screen.getByRole("button", { name: "-" });
    await user.click(decrementButton);

    // 数量が2になる
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("数量が在庫数と同じ時、増やすボタンが無効化される", () => {
    const product = mockProducts[0];
    const cartItems = [
      { product, quantity: product.stock, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    const incrementButton = screen.getByRole("button", { name: "+" });
    expect(incrementButton).toBeDisabled();
  });

  it("「買い物を続ける」ボタンをクリックするとコールバックが呼ばれる", async () => {
    const user = userEvent.setup();
    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    const continueButton = screen.getByRole("button", {
      name: "買い物を続ける",
    });
    await user.click(continueButton);

    expect(mockOnContinueShopping).toHaveBeenCalledTimes(1);
  });

  it("「購入手続きへ」ボタンが表示される（商品がある場合）", () => {
    const cartItems = [
      { product: mockProducts[0], quantity: 1, addedAt: Date.now() },
    ];

    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    expect(
      screen.getByRole("button", { name: "購入手続きへ" })
    ).toBeInTheDocument();
  });

  it("「購入手続きへ」ボタンは表示されない（空のカートの場合）", () => {
    render(<Cart onContinueShopping={mockOnContinueShopping} />);

    expect(
      screen.queryByRole("button", { name: "購入手続きへ" })
    ).not.toBeInTheDocument();
  });
});
