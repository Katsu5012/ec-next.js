import type { AppProps } from 'next/app';
import { Provider as UrqlProvider } from 'urql';
import { createUrqlClient } from '@/lib/urql';
import '@/styles/globals.css';

const urqlClient = createUrqlClient();

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { worker } = require('../mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass', // モックされていないリクエストは通す
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UrqlProvider value={urqlClient}>
      <Component {...pageProps} />
    </UrqlProvider>
  );
}
