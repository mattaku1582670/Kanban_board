import { requireSupabaseClient } from "@/lib/supabaseClient";
import type { Card, CardStatus } from "@/features/cards/types/card";

const KANBAN_CARDS_TABLE = "miniapp_kanban_cards";

type CreateCardPayload = {
  userId: string;
  title: string;
  description: string;
  status: CardStatus;
  position: number;
};

type UpdateCardPayload = {
  userId: string;
  cardId: string;
  title: string;
  description: string;
};

type DeleteCardPayload = {
  userId: string;
  cardId: string;
};

type MoveCardPayload = {
  userId: string;
  cardId: string;
  status: CardStatus;
  position: number;
};

export async function loadCardsFromSupabase(userId: string): Promise<Card[]> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from(KANBAN_CARDS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("status", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Card[];
}

export async function createCardInSupabase(payload: CreateCardPayload): Promise<Card> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from(KANBAN_CARDS_TABLE)
    .insert({
      user_id: payload.userId,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      position: payload.position
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Card;
}

export async function updateCardInSupabase(payload: UpdateCardPayload): Promise<Card> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from(KANBAN_CARDS_TABLE)
    .update({
      title: payload.title,
      description: payload.description
    })
    .eq("id", payload.cardId)
    .eq("user_id", payload.userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Card;
}

export async function deleteCardFromSupabase(payload: DeleteCardPayload): Promise<void> {
  const client = requireSupabaseClient();
  const { error } = await client
    .from(KANBAN_CARDS_TABLE)
    .delete()
    .eq("id", payload.cardId)
    .eq("user_id", payload.userId);

  if (error) {
    throw error;
  }
}

export async function moveCardInSupabase(payload: MoveCardPayload): Promise<Card> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from(KANBAN_CARDS_TABLE)
    .update({
      status: payload.status,
      position: payload.position
    })
    .eq("id", payload.cardId)
    .eq("user_id", payload.userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Card;
}
