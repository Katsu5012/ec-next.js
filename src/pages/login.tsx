// pages/login.tsx
import { useRouter } from "next/router";
import { Login } from "../components/Login";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    const returnUrl = (router.query.returnUrl as string) || "/";
    router.push(returnUrl);
  };

  return <Login onSuccess={handleLoginSuccess} />;
}
