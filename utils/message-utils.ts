import {getEmptyState} from "../reducers/message.reducer";
import {default as Message} from "../types/Message";

export function isEmpty(message: Message): boolean {
	const emptyMessage = getEmptyState();

	return (
		message.date === emptyMessage.date &&
		message.message === emptyMessage.message &&
		message.name === emptyMessage.name &&
		message.language === emptyMessage.language &&
		message.checks.every((check, index) => emptyMessage.checks[index] === check)
	);
}
