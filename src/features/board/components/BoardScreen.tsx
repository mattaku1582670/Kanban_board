import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Header } from "@/features/board/components/Header";
import { Board } from "@/features/board/components/Board";
import { CardDialog } from "@/features/cards/components/CardDialog";
import { ConfirmDialog } from "@/features/cards/components/ConfirmDialog";
import { useCards } from "@/features/cards/hooks/useCards";
import type {
  Card,
  CardStatus,
  CreateCardInput,
  UpdateCardInput
} from "@/features/cards/types/card";
import styles from "@/features/board/styles/BoardScreen.module.css";

type BoardScreenProps = {
  user: User;
  authBusy: boolean;
  onSignOut: () => Promise<void>;
};

type CardDialogState =
  | {
      open: false;
      mode: "create";
      status: CardStatus;
      card: null;
    }
  | {
      open: true;
      mode: "create" | "edit";
      status: CardStatus;
      card: Card | null;
    };

export function BoardScreen({ user, authBusy, onSignOut }: BoardScreenProps) {
  const { board, cards, loading, isMutating, error, clearError, createCard, updateCard, deleteCard, moveCard } =
    useCards(user.id);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [cardDialog, setCardDialog] = useState<CardDialogState>({
    open: false,
    mode: "create",
    status: "todo",
    card: null
  });
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  const busy = authBusy || isMutating;

  function openCreateDialog(status: CardStatus = "todo") {
    setCardDialog({
      open: true,
      mode: "create",
      status,
      card: null
    });
  }

  function openEditDialog(card: Card) {
    setCardDialog({
      open: true,
      mode: "edit",
      status: card.status,
      card
    });
  }

  function closeCardDialog() {
    if (!busy) {
      setCardDialog({
        open: false,
        mode: "create",
        status: "todo",
        card: null
      });
    }
  }

  async function handleCardSubmit(input: CreateCardInput | UpdateCardInput) {
    const succeeded =
      cardDialog.mode === "create"
        ? await createCard(input as CreateCardInput)
        : cardDialog.card
          ? await updateCard(cardDialog.card.id, input as UpdateCardInput)
          : false;

    if (succeeded) {
      closeCardDialog();
    }
  }

  async function handleDeleteConfirm() {
    if (!cardToDelete) {
      return;
    }

    const succeeded = await deleteCard(cardToDelete.id);

    if (succeeded) {
      setCardToDelete(null);
    }
  }

  async function handleMoveCard(cardId: string, nextStatus: CardStatus) {
    await moveCard(cardId, nextStatus);
    setDraggingCardId(null);
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.loadingPanel}>カードを読み込んでいます...</div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <Header
          board={board}
          userEmail={user.email ?? "unknown"}
          busy={busy}
          onAddCard={() => openCreateDialog("todo")}
          onSignOut={onSignOut}
        />

        {error ? (
          <div className={styles.errorBanner} role="alert">
            <span>{error}</span>
            <button className={styles.bannerButton} type="button" onClick={clearError}>
              閉じる
            </button>
          </div>
        ) : null}

        <Board
          board={board}
          draggingCardId={draggingCardId}
          disabled={busy}
          onAddCard={openCreateDialog}
          onEditCard={openEditDialog}
          onDeleteCard={setCardToDelete}
          onMoveCard={handleMoveCard}
          onDragStart={setDraggingCardId}
          onDragEnd={() => setDraggingCardId(null)}
        />

        <CardDialog
          open={cardDialog.open}
          mode={cardDialog.mode}
          status={cardDialog.status}
          card={cardDialog.card}
          isSubmitting={busy}
          onClose={closeCardDialog}
          onSubmit={handleCardSubmit}
        />

        <ConfirmDialog
          open={Boolean(cardToDelete)}
          cardTitle={cardToDelete?.title ?? ""}
          isSubmitting={busy}
          onClose={() => {
            if (!busy) {
              setCardToDelete(null);
            }
          }}
          onConfirm={handleDeleteConfirm}
        />

        {cards.length === 0 ? (
          <p className={styles.footerNote}>
            初回は空のボードです。TODO 列か右上ボタンからカードを追加してください。
          </p>
        ) : null}
      </div>
    </section>
  );
}
