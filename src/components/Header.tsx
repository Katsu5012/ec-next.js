import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../hooks/useCart";

export const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const router = useRouter();

  // 現在のパスからページを判定
  const currentPage =
    router.pathname === "/cart"
      ? "cart"
      : router.pathname === "/quantity"
      ? "quantity"
      : "products";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">ECサイト</h1>
          </Link>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-6">
            {/* ページインジケーター */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span
                className={`px-3 py-1 rounded-full ${
                  currentPage === "products"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                商品一覧
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`px-3 py-1 rounded-full ${
                  currentPage === "quantity"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                購入数選択
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`px-3 py-1 rounded-full ${
                  currentPage === "cart"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                カート
              </span>
            </div>

            {/* カートアイコン */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
