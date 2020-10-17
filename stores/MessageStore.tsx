import { useReducer } from 'react';
import { messageReducer, getEmptyState } from '../reducers/messageReducer';
import MessageContext from '../contexts/MessageContext';

export default function MessageStore({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element {
  const [message, dispatch] = useReducer(messageReducer, getEmptyState());

  return (
    <MessageContext.Provider value={[message, dispatch]}>
      {children}
    </MessageContext.Provider>
  );
}