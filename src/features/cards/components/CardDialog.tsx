import { useEffect, useId, useState } from "react";
import { Modal } from "@/shared/components/Modal";
import { COLUMN_META } from "@/shared/constants/board";
import type {
  Card,
  CardStatus,
  CreateCardInput,
  UpdateCardInput
} from "@/features/cards/types/card";
import styles from "@/features/cards/components/CardDialog.module.css";

type CardDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  status: CardStatus;
  card: Card | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCardInput | UpdateCardInput) => Promise<void>;
};

export function CardDialog({
  open,
  mode,
  status,
  card,
  isSubmitting,
  onClose,
  onSubmit
}: CardDialogProps) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(card?.title ?? "");
    setDescription(card?.description ?? "");
    setError(null);
  }, [card, mode, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      setError("タイトルを入力してください。");
      return;
    }

    setError(null);

    if (mode === "create") {
      await onSubmit({
        title: normalizedTitle,
        description: normalizedDescription,
        status
      });
      return;
    }

    await onSubmit({
      title: normalizedTitle,
      description: normalizedDescription
    });
  }

  return (
    <Modal open={open} onClose={onClose} closeDisabled={isSubmitting}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Card Editor</p>
            <h2 id={titleId} className={styles.title}>
              {mode === "create" ? "カードを追加" : "カードを編集"}
            </h2>
          </div>
          <p className={styles.hint}>{COLUMN_META[status].label}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} aria-labelledby={titleId}>
          <label className={styles.field}>
            <span className={styles.label}>タイトル</span>
            <input
              className={styles.input}
              type="text"
              maxLength={120}
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>説明</span>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <p className={styles.validation} role="alert">
            {error ?? ""}
          </p>

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存する"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
