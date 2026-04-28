import { useState } from "react";
import type { AuthCredentials } from "@/features/auth/services/authService";
import styles from "@/features/auth/components/AuthScreen.module.css";

type AuthScreenProps = {
  busy: boolean;
  error: string | null;
  message: string | null;
  onSignIn: (credentials: AuthCredentials) => Promise<void>;
  onSignUp: (credentials: AuthCredentials) => Promise<void>;
  onClearFeedback: () => void;
};

export function AuthScreen({
  busy,
  error,
  message,
  onSignIn,
  onSignUp,
  onClearFeedback
}: AuthScreenProps) {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const credentials: AuthCredentials = {
      email: email.trim(),
      password
    };

    if (mode === "signIn") {
      await onSignIn(credentials);
      return;
    }

    await onSignUp(credentials);
  }

  function switchMode(nextMode: "signIn" | "signUp") {
    setMode(nextMode);
    onClearFeedback();
  }

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Supabase Auth</p>
          <h1 className={styles.title}>Kanban Board</h1>
          <p className={styles.lead}>
            ログインごとにカードを分離して保存する、Vercel + Supabase 前提のカンバンボードです。
          </p>
        </div>

        <div className={styles.modeSwitch} role="tablist" aria-label="認証モード">
          <button
            className={mode === "signIn" ? styles.modeButtonActive : styles.modeButton}
            type="button"
            onClick={() => switchMode("signIn")}
          >
            ログイン
          </button>
          <button
            className={mode === "signUp" ? styles.modeButtonActive : styles.modeButton}
            type="button"
            onClick={() => switchMode("signUp")}
          >
            新規登録
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>メールアドレス</span>
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={busy}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>パスワード</span>
            <input
              className={styles.input}
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
              required
            />
          </label>

          {message ? (
            <p className={styles.message} role="status">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          <button className={styles.submitButton} type="submit" disabled={busy}>
            {busy ? "処理中..." : mode === "signIn" ? "ログイン" : "アカウントを作成"}
          </button>
        </form>
      </div>
    </section>
  );
}
