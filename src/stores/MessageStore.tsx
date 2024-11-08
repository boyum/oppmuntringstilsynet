import { type ReactNode, useReducer } from "react";
import { MessageContext } from "../contexts/MessageContext";
import { getEmptyState, messageReducer } from "../reducers/message.reducer";

export type Props = {
  children: ReactNode;
};

export const MessageStore: React.FC<Props> = ({ children }) => {
  const [message, dispatchMessageAction] = useReducer(
    messageReducer,
    getEmptyState(),
  );

  return (
    <MessageContext.Provider value={[message, dispatchMessageAction]}>
      {children}
    </MessageContext.Provider>
  );
};
