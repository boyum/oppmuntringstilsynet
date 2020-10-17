import { getEmptyState } from '../reducers/messageReducer';
import Message from '../types/Message';

export function isEmpty(message: Message): boolean {
  const emptyMessage = getEmptyState();

  return message.date === emptyMessage.date 
    && message.message === emptyMessage.message
    && message.name === emptyMessage.name
    && message.checks.every((check, index) => emptyMessage.checks[index] === check)
}