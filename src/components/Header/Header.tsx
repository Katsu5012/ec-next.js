import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // 現在のパスからページを判定
  const currentPage =
    router.pathname === '/checkout' || router.pathname === '/order-complete'
      ? 'checkout'
      : router.pathname === '/cart'
        ? 'cart'
        : router.pathname === '/quantity'
          ? 'quantity'
          : 'products';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">ECサイト</h1>
          </Link>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-6">
            {/* ページインジケーター */}
            <div className="hidden items-center gap-2 text-sm md:flex">
              {(['products', 'quantity', 'cart', 'checkout'] as const).map((page, i) => {
                const labels = {
                  products: '商品一覧',
                  quantity: '購入数選択',
                  cart: 'カート',
                  checkout: '購入手続き',
                };
                return (
                  <React.Fragment key={page}>
                    {i > 0 ? <span className="text-muted-foreground">→</span> : null}
                    <Badge variant={currentPage === page ? 'default' : 'secondary'}>
                      {labels[page]}
                    </Badge>
                  </React.Fragment>
                );
              })}
            </div>

            {/* カートアイコン */}
            <Link
              href="/cart"
              suppressHydrationWarning
              className="relative rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && user ? (
                <span
                  className={cn(
                    'absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'
                  )}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              ) : null}
            </Link>

            {/* ユーザー情報 */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.name}</span>
                <Link
                  href="/orders"
                  className="text-sm text-gray-700 transition-colors hover:text-primary"
                >
                  注文履歴
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  ログアウト
                </Button>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
};
