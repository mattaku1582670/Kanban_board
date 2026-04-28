import type { BoardState } from "@/features/cards/types/card";
import styles from "@/features/board/styles/Header.module.css";

type HeaderProps = {
  board: BoardState;
  userEmail: string;
  busy: boolean;
  onAddCard: () => void;
  onSignOut: () => Promise<void>;
};

export function Header({ board, userEmail, busy, onAddCard, onSignOut }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Realtime-ready Workspace</p>
        <h1 className={styles.title}>Kanban Board</h1>
        <p className={styles.stat}>
          TODO {board.todo.length} / DOING {board.doing.length} / DONE {board.done.length}
        </p>
      </div>

      <div className={styles.actions}>
        <div className={styles.userCard}>
          <span className={styles.userLabel}>ログイン中</span>
          <strong className={styles.userEmail}>{userEmail}</strong>
        </div>
        <button className={styles.primaryButton} type="button" onClick={onAddCard} disabled={busy}>
          カードを追加
        </button>
        <button className={styles.secondaryButton} type="button" onClick={() => void onSignOut()} disabled={busy}>
          {busy ? "処理中..." : "ログアウト"}
        </button>
      </div>
    </header>
  );
}
