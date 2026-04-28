import { AuthScreen } from "@/features/auth/components/AuthScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { BoardScreen } from "@/features/board/components/BoardScreen";
import { SUPABASE_CONFIG_ERROR, isSupabaseConfigured } from "@/lib/supabaseClient";
import styles from "@/app/App.module.css";

export function App() {
  const auth = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <main className={styles.page}>
        <section className={styles.noticeCard}>
          <p className={styles.noticeEyebrow}>Configuration Required</p>
          <h1 className={styles.noticeTitle}>Supabase の接続情報が未設定です</h1>
          <p className={styles.noticeText}>{SUPABASE_CONFIG_ERROR}</p>
          <code className={styles.noticeCode}>VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY</code>
        </section>
      </main>
    );
  }

  if (auth.loading) {
    return (
      <main className={styles.page}>
        <section className={styles.noticeCard}>
          <p className={styles.noticeEyebrow}>Loading</p>
          <h1 className={styles.noticeTitle}>認証状態を確認しています</h1>
        </section>
      </main>
    );
  }

  if (!auth.user) {
    return (
      <main className={styles.page}>
        <AuthScreen
          busy={auth.busy}
          error={auth.error}
          message={auth.message}
          onSignIn={auth.signIn}
          onSignUp={auth.signUp}
          onClearFeedback={auth.clearFeedback}
        />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <BoardScreen user={auth.user} authBusy={auth.busy} onSignOut={auth.signOut} />
    </main>
  );
}
