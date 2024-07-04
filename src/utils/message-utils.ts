import { getEmptyState, serializedEmpty } from "../reducers/message.reducer";
import type { Message } from "../types/Message";

export function isEmpty(message: Message): boolean {
  const serializedMessage = JSON.stringify(message);

  return serializedEmpty === serializedMessage;
}

export function createEmptyMessage(): Message {
  return {
    ...getEmptyState(),
  };
}
