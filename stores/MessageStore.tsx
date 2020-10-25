import React, { useReducer } from 'react';
import { messageReducer, getEmptyState } from '../reducers/message.reducer';
import MessageContext from '../contexts/MessageContext';

function MessageStore({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element {
  const [message, dispatch] = useReducer(messageReducer, getEmptyState());

  return (
    <MessageContext.Provider value={[message, dispatch]}>
      {children}
    </MessageContext.Provider>
  );
}

export default MessageStore;
