import { createContext, Dispatch } from "react";
import {
  getEmptyState,
  type MessageActionType,
} from "../reducers/message.reducer";
import { Message } from "../types/Message";

const defaultState: [Message, Dispatch<MessageActionType>] = [
  getEmptyState(),
  // @ts-expect-error this is `null` at first,
  // then React updates it behind the scenes.
  null,
];

export const MessageContext = createContext(defaultState);
