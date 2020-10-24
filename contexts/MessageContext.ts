import {Dispatch, default as React} from "react";
import {MessageAction} from "../reducers/message.reducer";
import {default as Message} from "../types/Message";

const defaultState: [Message, Dispatch<MessageAction>] = [undefined, undefined];
export default React.createContext(defaultState);
