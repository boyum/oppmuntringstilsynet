import React, { Dispatch } from "react";
import { MessageAction } from "../reducers/message.reducer";
import Message from "../types/Message";
import { createEmptyMessage } from '../utils/message-utils';

const defaultState: [Message, Dispatch<MessageAction> | null] = [
  createEmptyMessage(),
  null,
];
export default React.createContext(defaultState);
