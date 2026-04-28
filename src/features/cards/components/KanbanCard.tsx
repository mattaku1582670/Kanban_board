import { COLUMN_META, COLUMN_ORDER } from "@/shared/constants/board";
import { formatDateTime } from "@/shared/utils/date";
import type { Card, CardStatus } from "@/features/cards/types/card";
import styles from "@/features/cards/components/KanbanCard.module.css";

type KanbanCardProps = {
  card: Card;
  disabled: boolean;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  onMove: (cardId: string, nextStatus: CardStatus) => Promise<void>;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
};

export function KanbanCard({
  card,
  disabled,
  onEdit,
  onDelete,
  onMove,
  onDragStart,
  onDragEnd
}: KanbanCardProps) {
  const mobileTargets = COLUMN_ORDER.filter((status) => status !== card.status);

  return (
    <article
      className={styles.card}
      data-status={card.status}
      data-draggable={String(!disabled)}
      draggable={!disabled}
      onDragStart={() => onDragStart(card.id)}
      onDragEnd={onDragEnd}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.description}>{card.description || "説明は未入力です。"}</p>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.meta}>更新: {formatDateTime(card.updated_at)}</span>
        <div className={styles.actions}>
          <button className={styles.ghostButton} type="button" onClick={() => onEdit(card)} disabled={disabled}>
            編集
          </button>
          <button className={styles.dangerButton} type="button" onClick={() => onDelete(card)} disabled={disabled}>
            削除
          </button>
        </div>
      </div>

      <div className={styles.mobileMoveActions}>
        {mobileTargets.map((status) => (
          <button
            key={status}
            className={styles.mobileMoveButton}
            type="button"
            onClick={() => void onMove(card.id, status)}
            disabled={disabled}
          >
            {COLUMN_META[status].label}へ
          </button>
        ))}
      </div>
    </article>
  );
}
