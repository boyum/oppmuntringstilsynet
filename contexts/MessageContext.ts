import React, { Dispatch } from 'react';
import { MessageAction } from '../reducers/message.reducer';
import Message from '../types/Message';

const defaultState: [Message, Dispatch<MessageAction>] = [undefined, undefined];
export default React.createContext(defaultState);
