import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '@/components/Header/Header';
import { Checkout } from '@/components/Checkout/Checkout';
import { AuthGuard } from '@/components/AuthGuard';
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems } = useCart();

  // カートが空の場合はカートページへリダイレクト
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Header />
      <main>
        <AuthGuard>
          <Checkout />
        </AuthGuard>
      </main>
    </>
  );
}
