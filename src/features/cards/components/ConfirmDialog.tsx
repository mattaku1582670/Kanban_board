import { useId } from "react";
import { Modal } from "@/shared/components/Modal";
import styles from "@/features/cards/components/ConfirmDialog.module.css";

type ConfirmDialogProps = {
  open: boolean;
  cardTitle: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function ConfirmDialog({
  open,
  cardTitle,
  isSubmitting,
  onClose,
  onConfirm
}: ConfirmDialogProps) {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onClose} closeDisabled={isSubmitting}>
      <div className={styles.dialog}>
        <p className={styles.eyebrow}>Delete</p>
        <h2 id={titleId} className={styles.title}>
          カードを削除
        </h2>
        <p className={styles.message}>
          「{cardTitle}」を削除します。この操作は元に戻せません。
        </p>

        <div className={styles.actions} aria-labelledby={titleId}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "削除中..." : "削除する"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
