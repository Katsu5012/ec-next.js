import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@/test/test-utils';
import { render as rtlRender } from '@testing-library/react';
import { Provider as UrqlProvider } from 'urql';
import { createUrqlClient } from '@/lib/urql';
import { OrderHistory } from './OrderHistory';
import { server } from '@/mocks/server';
import { graphql, HttpResponse } from 'msw';

const renderWithFreshClient = () => {
  const freshClient = createUrqlClient();
  return rtlRender(
    <UrqlProvider value={freshClient}>
      <OrderHistory />
    </UrqlProvider>
  );
};

describe('OrderHistory', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('ローディング中はスピナーが表示される', () => {
    render(<OrderHistory />);
    // 非同期でデータが来る前はスピナーが存在する
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('データ取得後に「注文履歴」見出しが表示される', async () => {
    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '注文履歴', level: 1 })).toBeInTheDocument();
    });
  });

  it('注文履歴が正しく表示される', async () => {
    render(<OrderHistory />);

    await waitFor(() => {
      // 注文番号
      expect(screen.getByText('order-001')).toBeInTheDocument();
      // 商品名
      expect(screen.getByText('ワイヤレスイヤホン')).toBeInTheDocument();
      expect(screen.getByText('ワイヤレスマウス')).toBeInTheDocument();
    });
  });

  it('注文ステータスが日本語で表示される', async () => {
    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('配達完了')).toBeInTheDocument();
      expect(screen.getByText('発送済み')).toBeInTheDocument();
      expect(screen.getByText('処理中')).toBeInTheDocument();
    });
  });

  it('合計金額が表示される', async () => {
    render(<OrderHistory />);

    await waitFor(() => {
      // order-001 の合計金額 21,940円
      expect(screen.getByText('¥21,940')).toBeInTheDocument();
    });
  });

  it('注文が空の場合は「注文履歴がありません」が表示される', async () => {
    server.use(graphql.query('GetOrdersQuery', () => HttpResponse.json({ data: { orders: [] } })));

    renderWithFreshClient();

    await waitFor(() => {
      expect(screen.getByText('注文履歴がありません')).toBeInTheDocument();
    });
  });

  it('エラー時はエラーメッセージが表示される', async () => {
    server.use(
      graphql.query('GetOrdersQuery', () =>
        HttpResponse.json({ errors: [{ message: 'Internal Server Error' }] })
      )
    );

    renderWithFreshClient();

    await waitFor(() => {
      expect(screen.getByText('注文履歴の取得に失敗しました。')).toBeInTheDocument();
    });
  });
});
