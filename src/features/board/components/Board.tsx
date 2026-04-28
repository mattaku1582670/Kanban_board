import { COLUMN_ORDER } from "@/shared/constants/board";
import type { BoardState, Card, CardStatus } from "@/features/cards/types/card";
import { KanbanColumn } from "@/features/board/components/KanbanColumn";
import styles from "@/features/board/styles/Board.module.css";

type BoardProps = {
  board: BoardState;
  draggingCardId: string | null;
  disabled: boolean;
  onAddCard: (status: CardStatus) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
  onMoveCard: (cardId: string, nextStatus: CardStatus) => Promise<void>;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
};

export function Board({
  board,
  draggingCardId,
  disabled,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onMoveCard,
  onDragStart,
  onDragEnd
}: BoardProps) {
  return (
    <main className={styles.board}>
      {COLUMN_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          cards={board[status]}
          draggingCardId={draggingCardId}
          disabled={disabled}
          onAddCard={onAddCard}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
          onMoveCard={onMoveCard}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </main>
  );
}
