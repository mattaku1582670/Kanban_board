import type { CardStatus } from "@/features/cards/types/card";

export const COLUMN_ORDER: CardStatus[] = ["todo", "doing", "done"];

export const COLUMN_META: Record<
  CardStatus,
  {
    label: string;
    eyebrow: string;
    description: string;
  }
> = {
  todo: {
    label: "TODO",
    eyebrow: "Queue",
    description: "着手前のタスク"
  },
  doing: {
    label: "DOING",
    eyebrow: "Focus",
    description: "進行中のタスク"
  },
  done: {
    label: "DONE",
    eyebrow: "Archive",
    description: "完了済みのタスク"
  }
};
