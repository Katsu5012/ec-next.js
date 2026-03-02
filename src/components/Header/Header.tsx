import React, { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">ECサイト</h1>
          </Link>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-6">
            {/* ページインジケーター */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              {(['products', 'quantity', 'cart', 'checkout'] as const).map((page, i) => {
                const labels = {
                  products: '商品一覧',
                  quantity: '購入数選択',
                  cart: 'カート',
                  checkout: '購入手続き',
                };
                return (
                  <React.Fragment key={page}>
                    {i > 0 && <span className="text-muted-foreground">→</span>}
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
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {mounted && totalItems > 0 && user ? (
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
            {mounted && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.name}</span>
                <Link
                  href="/orders"
                  className="text-sm text-gray-700 hover:text-primary transition-colors"
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
