import { cacheExchange, createClient, fetchExchange, ssrExchange } from 'urql';

const isServerSide = typeof window === 'undefined';

// SSR Exchange
const ssr = ssrExchange({
  isClient: !isServerSide,
});

export const createUrqlClient = () => {
  return createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql',
    exchanges: [cacheExchange, ssr, fetchExchange],
    // フェッチオプション
    fetchOptions: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

export { ssr };
