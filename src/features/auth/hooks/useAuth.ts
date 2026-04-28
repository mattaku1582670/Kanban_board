import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  getCurrentUser,
  onAuthStateChange,
  signIn,
  signOut,
  signUp,
  type AuthCredentials
} from "@/features/auth/services/authService";
import { toErrorMessage } from "@/shared/utils/error";

type UseAuthResult = {
  user: User | null;
  loading: boolean;
  busy: boolean;
  error: string | null;
  message: string | null;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  clearFeedback: () => void;
};

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (nextError) {
        if (isMounted) {
          setError(toErrorMessage(nextError, "認証状態の確認に失敗しました。"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    const {
      data: { subscription }
    } = onAuthStateChange((nextUser) => {
      if (!isMounted) {
        return;
      }

      setUser(nextUser);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignIn(credentials: AuthCredentials) {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await signIn(credentials);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "ログインに失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(credentials: AuthCredentials) {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await signUp(credentials);

      if (!response.data.session) {
        setMessage("確認メールを送信しました。メール内のリンクを開いて認証してください。");
      }
    } catch (nextError) {
      setError(toErrorMessage(nextError, "アカウント作成に失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await signOut();
    } catch (nextError) {
      setError(toErrorMessage(nextError, "ログアウトに失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  function clearFeedback() {
    setError(null);
    setMessage(null);
  }

  return {
    user,
    loading,
    busy,
    error,
    message,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    clearFeedback
  };
}
