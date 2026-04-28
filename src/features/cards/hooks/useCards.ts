import { useEffect, useState } from "react";
import {
  createCardInSupabase,
  deleteCardFromSupabase,
  loadCardsFromSupabase,
  moveCardInSupabase,
  updateCardInSupabase
} from "@/features/cards/services/cardsService";
import type {
  BoardState,
  Card,
  CardStatus,
  CreateCardInput,
  UpdateCardInput
} from "@/features/cards/types/card";
import {
  getNextPosition,
  groupCardsByStatus,
  removeCardById,
  sortCards,
  upsertCard
} from "@/shared/utils/cards";
import { toErrorMessage } from "@/shared/utils/error";

type UseCardsResult = {
  cards: Card[];
  board: BoardState;
  loading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshCards: () => Promise<void>;
  createCard: (input: CreateCardInput) => Promise<boolean>;
  updateCard: (cardId: string, input: UpdateCardInput) => Promise<boolean>;
  deleteCard: (cardId: string) => Promise<boolean>;
  moveCard: (cardId: string, nextStatus: CardStatus) => Promise<boolean>;
  clearError: () => void;
};

export function useCards(userId: string): UseCardsResult {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const nextCards = await loadCardsFromSupabase(userId);

        if (isMounted) {
          setCards(sortCards(nextCards));
        }
      } catch (nextError) {
        if (isMounted) {
          setCards([]);
          setError(toErrorMessage(nextError, "カードの取得に失敗しました。"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  async function refreshCards() {
    setLoading(true);
    setError(null);

    try {
      const nextCards = await loadCardsFromSupabase(userId);
      setCards(sortCards(nextCards));
    } catch (nextError) {
      setError(toErrorMessage(nextError, "カードの再取得に失敗しました。"));
    } finally {
      setLoading(false);
    }
  }

  async function createCard(input: CreateCardInput): Promise<boolean> {
    setIsMutating(true);
    setError(null);

    try {
      const createdCard = await createCardInSupabase({
        userId,
        title: input.title,
        description: input.description,
        status: input.status,
        position: getNextPosition(cards, input.status)
      });

      setCards((currentCards) => upsertCard(currentCards, createdCard));
      return true;
    } catch (nextError) {
      setError(toErrorMessage(nextError, "カードの追加に失敗しました。"));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function updateCard(cardId: string, input: UpdateCardInput): Promise<boolean> {
    setIsMutating(true);
    setError(null);

    try {
      const updatedCard = await updateCardInSupabase({
        userId,
        cardId,
        title: input.title,
        description: input.description
      });

      setCards((currentCards) => upsertCard(currentCards, updatedCard));
      return true;
    } catch (nextError) {
      setError(toErrorMessage(nextError, "カードの更新に失敗しました。"));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteCard(cardId: string): Promise<boolean> {
    setIsMutating(true);
    setError(null);

    try {
      await deleteCardFromSupabase({
        userId,
        cardId
      });

      setCards((currentCards) => removeCardById(currentCards, cardId));
      return true;
    } catch (nextError) {
      setError(toErrorMessage(nextError, "カードの削除に失敗しました。"));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function moveCard(cardId: string, nextStatus: CardStatus): Promise<boolean> {
    const targetCard = cards.find((card) => card.id === cardId);

    if (!targetCard || targetCard.status === nextStatus) {
      return true;
    }

    setIsMutating(true);
    setError(null);

    const nextPosition = getNextPosition(cards, nextStatus);
    const snapshot = cards.slice();
    const optimisticCard: Card = {
      ...targetCard,
      status: nextStatus,
      position: nextPosition,
      updated_at: new Date().toISOString()
    };

    setCards((currentCards) => upsertCard(currentCards, optimisticCard));

    try {
      const savedCard = await moveCardInSupabase({
        userId,
        cardId,
        status: nextStatus,
        position: nextPosition
      });

      setCards((currentCards) => upsertCard(currentCards, savedCard));
      return true;
    } catch (nextError) {
      setCards(snapshot);
      setError(toErrorMessage(nextError, "カードの移動に失敗しました。"));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return {
    cards,
    board: groupCardsByStatus(cards),
    loading,
    isMutating,
    error,
    refreshCards,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    clearError
  };
}
