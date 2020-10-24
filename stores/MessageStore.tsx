import {useReducer} from "react";
import {getEmptyState, messageReducer} from "../reducers/message.reducer";
import {default as MessageContext} from "../contexts/MessageContext";

export default function MessageStore(
	{children}: {
		children: JSX.Element | Array<JSX.Element>;
	},
): JSX.Element {
	const [message, dispatch] = useReducer(messageReducer, getEmptyState());

	return <MessageContext.Provider value={[message, dispatch]}>
		{children}
	</MessageContext.Provider>;
}
