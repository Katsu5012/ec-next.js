import { useRouter } from 'next/router';
import { Header } from '@/components/Header/Header';
import { Cart } from '@/components/Cart/Cart';
import { AuthGuard } from '@/components/AuthGuard';

export default function CartPage() {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <>
      <Header />
      <main>
        <AuthGuard>
          <Cart onContinueShopping={handleContinueShopping} onCheckout={handleCheckout} />
        </AuthGuard>
      </main>
    </>
  );
}
