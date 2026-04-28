import { useState } from "react";
import { COLUMN_META } from "@/shared/constants/board";
import type { Card, CardStatus } from "@/features/cards/types/card";
import { KanbanCard } from "@/features/cards/components/KanbanCard";
import styles from "@/features/board/styles/KanbanColumn.module.css";

type KanbanColumnProps = {
  status: CardStatus;
  cards: Card[];
  draggingCardId: string | null;
  disabled: boolean;
  onAddCard: (status: CardStatus) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
  onMoveCard: (cardId: string, nextStatus: CardStatus) => Promise<void>;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
};

export function KanbanColumn({
  status,
  cards,
  draggingCardId,
  disabled,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onMoveCard,
  onDragStart,
  onDragEnd
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);
  const meta = COLUMN_META[status];
  const columnClassName = [
    styles.column,
    status === "todo" ? styles.todo : "",
    status === "doing" ? styles.doing : "",
    status === "done" ? styles.done : "",
    isOver ? styles.over : ""
  ]
    .filter(Boolean)
    .join(" ");

  async function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsOver(false);

    if (!draggingCardId) {
      return;
    }

    await onMoveCard(draggingCardId, status);
  }

  function handleDragLeave(event: React.DragEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsOver(false);
    }
  }

  return (
    <section
      className={columnClassName}
      onDragOver={(event) => {
        event.preventDefault();
        if (draggingCardId) {
          setIsOver(true);
        }
      }}
      onDragLeave={handleDragLeave}
      onDrop={(event) => void handleDrop(event)}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{meta.eyebrow}</p>
          <h2 className={styles.title}>
            {meta.label}
            <span className={styles.badge}>{cards.length}</span>
          </h2>
          <p className={styles.description}>{meta.description}</p>
        </div>

        <button className={styles.addButton} type="button" onClick={() => onAddCard(status)} disabled={disabled}>
          追加
        </button>
      </header>

      <div className={styles.cardList}>
        {cards.length === 0 ? (
          <div className={styles.emptyState}>まだカードがありません。新しいタスクを追加してください。</div>
        ) : (
          cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              disabled={disabled}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onMove={onMoveCard}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </section>
  );
}
