import { useRouter } from 'next/router';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';

export default function CartPage() {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <>
      <Header />
      <main>
        <Cart onContinueShopping={handleContinueShopping} />
      </main>
    </>
  );
}
