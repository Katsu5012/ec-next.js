import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import { ProductList } from "./ProductList";
import { mockProducts } from "@/data/products";
import userEvent from "@testing-library/user-event";
import * as router from "next/router";
import type { NextRouter } from "next/router";

describe("ProductList", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    mockPush.mockClear();
    localStorage.clear();

    // NextRouter型を満たすモック
    vi.mocked(router.useRouter).mockReturnValue({
      push: mockPush,
      pathname: "/",
      route: "/",
      query: {},
      asPath: "/",
      basePath: "",
      isLocaleDomain: false,
      replace: vi.fn(),
      reload: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      beforePopState: vi.fn(),
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
      },
      isFallback: false,
      isReady: true,
      isPreview: false,
      locale: undefined,
      locales: undefined,
      defaultLocale: undefined,
      domainLocales: undefined,
    } as NextRouter);
  });

  it("商品一覧のタイトルが表示される", () => {
    render(<ProductList products={mockProducts} />);

    expect(
      screen.getByRole("heading", { name: "商品一覧", level: 1 })
    ).toBeInTheDocument();
  });

  it("商品リストが正しく表示される", () => {
    render(<ProductList products={mockProducts} />);

    mockProducts.forEach((product) => {
      expect(
        screen.getByRole("heading", { name: product.name, level: 3 })
      ).toBeInTheDocument();

      expect(
        screen.getByText(`¥${product.price.toLocaleString()}`)
      ).toBeInTheDocument();

      expect(screen.getByText(`在庫: ${product.stock}個`)).toBeInTheDocument();

      if (product.description) {
        expect(screen.getByText(product.description)).toBeInTheDocument();
      }
    });
  });

  it("各商品に画像が表示される", () => {
    render(<ProductList products={mockProducts} />);

    mockProducts.forEach((product) => {
      const img = screen.getByAltText(product.name);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", product.imageUrl);
    });
  });

  it("「購入数を選択」ボタンが表示される", () => {
    render(<ProductList products={mockProducts} />);

    const buttons = screen.getAllByRole("button", { name: "購入数を選択" });
    expect(buttons.length).toBe(mockProducts.length);
  });

  it("「購入数を選択」ボタンをクリックすると商品が選択され遷移する", async () => {
    const user = userEvent.setup();

    render(<ProductList products={mockProducts} />);

    const firstProductButton = screen.getAllByRole("button", {
      name: "購入数を選択",
    })[0];
    await user.click(firstProductButton);

    // 遷移が実行されたことを検証
    expect(mockPush).toHaveBeenCalledWith("/quantity");
    expect(mockPush).toHaveBeenCalledTimes(1);

    // localStorageに商品が保存されたことを確認
    const selectedProduct = localStorage.getItem("ec-selected-product");
    expect(selectedProduct).not.toBeNull();

    if (selectedProduct) {
      const parsed = JSON.parse(selectedProduct);
      expect(parsed.product.id).toBe(mockProducts[0].id);
      expect(parsed.quantity).toBe(1);
    }
  });

  it("在庫切れの商品は購入ボタンが無効化される", () => {
    const outOfStockProducts = mockProducts.map((p) => ({ ...p, stock: 0 }));
    render(<ProductList products={outOfStockProducts} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("在庫切れ");
    });
  });

  it("在庫が0の商品のボタンはグレーアウトされる", () => {
    const mixedProducts = [
      { ...mockProducts[0], stock: 0 },
      { ...mockProducts[1], stock: 10 },
    ];
    render(<ProductList products={mixedProducts} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toBeDisabled();
    expect(buttons[0]).toHaveTextContent("在庫切れ");
    expect(buttons[0]).toHaveClass("bg-gray-300");

    expect(buttons[1]).not.toBeDisabled();
    expect(buttons[1]).toHaveTextContent("購入数を選択");
    expect(buttons[1]).toHaveClass("bg-blue-600");
  });

  it("カートに入っている商品にはバッジが表示される", () => {
    const cartItems = [
      { product: mockProducts[0], quantity: 3, addedAt: Date.now() },
    ];
    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<ProductList products={mockProducts} />);

    expect(screen.getByText("カート内: 3個")).toBeInTheDocument();
  });

  it("カートに入っていない商品にはバッジが表示されない", () => {
    render(<ProductList products={mockProducts} />);

    expect(screen.queryByText(/カート内:/)).not.toBeInTheDocument();
  });

  it("複数の商品がカートに入っている場合、それぞれにバッジが表示される", () => {
    const cartItems = [
      { product: mockProducts[0], quantity: 2, addedAt: Date.now() },
      { product: mockProducts[1], quantity: 5, addedAt: Date.now() },
    ];
    localStorage.setItem("ec-cart-items", JSON.stringify(cartItems));

    render(<ProductList products={mockProducts} />);

    expect(screen.getByText("カート内: 2個")).toBeInTheDocument();
    expect(screen.getByText("カート内: 5個")).toBeInTheDocument();
  });

  it("空の商品リストが渡された場合、商品カードは表示されない", () => {
    render(<ProductList products={[]} />);

    expect(
      screen.getByRole("heading", { name: "商品一覧" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "購入数を選択" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "在庫切れ" })
    ).not.toBeInTheDocument();

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("特定の商品を選択すると、その商品の情報がlocalStorageに保存される", async () => {
    const user = userEvent.setup();
    render(<ProductList products={mockProducts} />);

    const secondProductButton = screen.getAllByRole("button", {
      name: "購入数を選択",
    })[1];
    await user.click(secondProductButton);

    const selectedProduct = localStorage.getItem("ec-selected-product");
    expect(selectedProduct).not.toBeNull();

    if (selectedProduct) {
      const parsed = JSON.parse(selectedProduct);
      expect(parsed.product.id).toBe(mockProducts[1].id);
      expect(parsed.product.name).toBe(mockProducts[1].name);
      expect(parsed.quantity).toBe(1);
    }
  });
});
