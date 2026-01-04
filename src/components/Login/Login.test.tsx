// src/components/Login.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { Login } from './Login';
import userEvent from '@testing-library/user-event';

describe('Login', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('ログインフォームが表示される', () => {
    render(<Login onSuccess={mockOnSuccess} />);

    expect(screen.getByRole('heading', { name: 'アカウントにログイン' })).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('デモ用アカウント情報が表示される', () => {
    render(<Login onSuccess={mockOnSuccess} />);

    expect(screen.getByText('デモ用アカウント')).toBeInTheDocument();
    expect(screen.getByText(/demo@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/password123/)).toBeInTheDocument();
  });

  it('メールアドレスが無効な場合、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<Login onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    });
  });

  it('パスワードが短い場合、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<Login onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('パスワードは6文字以上で入力してください')).toBeInTheDocument();
    });
  });

  it('正しい認証情報でログインできる', async () => {
    const user = userEvent.setup();
    render(<Login onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    await user.type(emailInput, 'demo@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    // localStorageに認証情報が保存される
    const authState = localStorage.getItem('auth-state');
    expect(authState).not.toBeNull();

    if (authState) {
      const parsed = JSON.parse(authState);
      expect(parsed.isAuthenticated).toBe(true);
      expect(parsed.user.email).toBe('demo@example.com');
    }
  });

  it('誤った認証情報でログインできない', async () => {
    const user = userEvent.setup();
    render(<Login onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/メールアドレスまたはパスワードが正しくありません/)
      ).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('ログイン中はボタンが無効化され、ローディング表示になる', async () => {
    const user = userEvent.setup();
    render(<Login onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');

    await user.type(emailInput, 'demo@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    // ✅ clickを開始
    await user.click(submitButton);

    // // ✅ 次のティックまで待機してから状態確認
    // await waitFor(() => {
    //   const button = screen.queryByRole("button", { name: /ログイン中/i });
    //   expect(button).toBeInTheDocument();
    // });

    const loadingButton = screen.getByRole('button', { name: /ログイン中/i });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toBeDisabled();

    // 完了まで待機
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('フォームがリセットされる', async () => {
    const user = userEvent.setup();
    render(<Login onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText('メールアドレス') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('パスワード') as HTMLInputElement;

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password');
  });
});
