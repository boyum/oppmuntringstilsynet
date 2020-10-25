import { createContext } from 'preact';
import { MessageAction } from '../reducers/message.reducer';
import Message from '../types/Message';

const defaultState: [Message, (action: MessageAction) => void] = [undefined, undefined];
export default createContext(defaultState);
