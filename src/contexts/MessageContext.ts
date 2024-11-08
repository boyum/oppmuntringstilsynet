import { Dispatch, createContext } from "react";
import { type MessageAction, getEmptyState } from "../reducers/message.reducer";
import { Message } from "../types/Message";

const defaultState: [Message, Dispatch<MessageAction>] = [
  getEmptyState(),
  // @ts-expect-error this is `null` at first,
  // then React updates it behind the scenes.
  null,
];

export const MessageContext = createContext(defaultState);
