import { Header } from '@/components/Header/Header';
import { OrderHistory } from '@/components/OrderHistory/OrderHistory';
import { AuthGuard } from '@/components/AuthGuard';

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main>
        <AuthGuard>
          <OrderHistory />
        </AuthGuard>
      </main>
    </>
  );
}
