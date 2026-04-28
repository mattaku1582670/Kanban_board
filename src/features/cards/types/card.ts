export type CardStatus = "todo" | "doing" | "done";

export type Card = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: CardStatus;
  position: number;
  created_at: string;
  updated_at: string;
};

export type BoardState = Record<CardStatus, Card[]>;

export type CreateCardInput = {
  title: string;
  description: string;
  status: CardStatus;
};

export type UpdateCardInput = {
  title: string;
  description: string;
};
