import { useRouter } from 'next/router';
import { Header } from '@/components/Header';
import { QuantitySelection } from '@/components/QuantitySelection';

export default function QuantityPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/cart');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <>
      <Header />
      <main>
        <QuantitySelection
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </main>
    </>
  );
}
