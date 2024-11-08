import { getEmptyState } from "../reducers/message.reducer";
import type { Message } from "../types/Message";

export function createEmptyMessage(): Message {
  return {
    ...getEmptyState(),
  };
}
