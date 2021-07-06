import deepEqual from "deep-equal";
import { getEmptyState } from "../reducers/message.reducer";
import Message from "../types/Message";

export function isEmpty(message: Message): boolean {
  const emptyMessage = getEmptyState();

  return deepEqual(message, emptyMessage);
}

export function createEmptyMessage(): Message {
  return {
    ...getEmptyState(),
  };
}
