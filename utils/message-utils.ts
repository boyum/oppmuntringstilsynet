import { getEmptyState } from "../reducers/message.reducer";
import Message from "../types/Message";

export function isEmpty(message: Message): boolean {
  const emptyMessage = getEmptyState();

  return (
    message.date === emptyMessage.date &&
    message.message === emptyMessage.message &&
    message.name === emptyMessage.name &&
    message.language === emptyMessage.language &&
    message.themeName === emptyMessage.themeName &&
    message.checks.every((check, index) => emptyMessage.checks[index] === check)
  );
}

export function createEmptyMessage(): Message {
  return {
    ...getEmptyState(),
  };
}
