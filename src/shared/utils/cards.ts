import type { BoardState, Card, CardStatus } from "@/features/cards/types/card";
import { COLUMN_ORDER } from "@/shared/constants/board";

const STATUS_INDEX = new Map(COLUMN_ORDER.map((status, index) => [status, index]));

export function groupCardsByStatus(cards: Card[]): BoardState {
  const grouped: BoardState = {
    todo: [],
    doing: [],
    done: []
  };

  for (const card of sortCards(cards)) {
    grouped[card.status].push(card);
  }

  return grouped;
}

export function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((left, right) => {
    const statusDiff =
      (STATUS_INDEX.get(left.status) ?? 0) - (STATUS_INDEX.get(right.status) ?? 0);

    if (statusDiff !== 0) {
      return statusDiff;
    }

    if (left.position !== right.position) {
      return left.position - right.position;
    }

    return left.created_at.localeCompare(right.created_at);
  });
}

export function getNextPosition(cards: Card[], status: CardStatus): number {
  const positions = cards
    .filter((card) => card.status === status)
    .map((card) => card.position);

  if (positions.length === 0) {
    return 0;
  }

  return Math.max(...positions) + 1;
}

export function upsertCard(cards: Card[], nextCard: Card): Card[] {
  const nextCards = cards.filter((card) => card.id !== nextCard.id);
  nextCards.push(nextCard);
  return sortCards(nextCards);
}

export function removeCardById(cards: Card[], cardId: string): Card[] {
  return cards.filter((card) => card.id !== cardId);
}
