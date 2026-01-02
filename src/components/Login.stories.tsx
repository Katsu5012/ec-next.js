// src/components/Login.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Login } from './Login';
import { within, userEvent, expect } from '@storybook/test';
import { Provider as UrqlProvider } from 'urql';
import { createUrqlClient } from '../lib/urql';

const urqlClient = createUrqlClient();

const meta = {
  title: 'Components/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: '/login',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <UrqlProvider value={urqlClient}>
        <Story />
      </UrqlProvider>
    ),
  ],
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSuccess: () => alert('ログイン成功！'),
  },
};

export const WithValidationErrors: Story = {
  args: {
    onSuccess: () => alert('ログイン成功！'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 無効なメールアドレスを入力
    const emailInput = canvas.getByLabelText('メールアドレス');
    await user.type(emailInput, 'invalid-email');

    // 短いパスワードを入力
    const passwordInput = canvas.getByLabelText('パスワード');
    await user.type(passwordInput, '123');

    // 送信
    const submitButton = canvas.getByRole('button', { name: 'ログイン' });
    await user.click(submitButton);

    // エラーメッセージを確認
    await expect(canvas.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    await expect(canvas.getByText('パスワードは6文字以上で入力してください')).toBeInTheDocument();
  },
};

export const FilledForm: Story = {
  args: {
    onSuccess: () => alert('ログイン成功！'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // デモアカウントで入力
    const emailInput = canvas.getByLabelText('メールアドレス');
    await user.type(emailInput, 'demo@example.com');

    const passwordInput = canvas.getByLabelText('パスワード');
    await user.type(passwordInput, 'password123');
  },
};

export const LoginSuccess: Story = {
  args: {
    onSuccess: () => alert('ログイン成功！'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 正しい認証情報で入力
    const emailInput = canvas.getByLabelText('メールアドレス');
    await user.type(emailInput, 'demo@example.com');

    const passwordInput = canvas.getByLabelText('パスワード');
    await user.type(passwordInput, 'password123');

    // 送信
    const submitButton = canvas.getByRole('button', { name: 'ログイン' });
    await user.click(submitButton);
  },
};

export const LoginFailure: Story = {
  args: {
    onSuccess: () => alert('ログイン成功！'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 誤った認証情報で入力
    const emailInput = canvas.getByLabelText('メールアドレス');
    await user.type(emailInput, 'wrong@example.com');

    const passwordInput = canvas.getByLabelText('パスワード');
    await user.type(passwordInput, 'wrongpassword');

    // 送信
    const submitButton = canvas.getByRole('button', { name: 'ログイン' });
    await user.click(submitButton);
  },
};
