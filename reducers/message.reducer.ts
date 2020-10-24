import {default as LanguageEnum} from "../enums/Language";
import {default as Message} from "../types/Message";

export type SetValuePayload = {
	date?: string;
	message?: string;
	checks?: Array<boolean>;
	name?: string;
	language?: LanguageEnum;
};

export type SetChecksPayload = {
	check: boolean;
};

export type MessageAction = {
	type: "setValue" | "setCheck" | "reset";
	// rome-ignore lint/ts/noExplicitAny
	payload?: any;
	checksIndex?: number;
};

export function getEmptyState(): Message {
	return {
		checks: [false, false, false],
		date: "",
		message: "",
		name: "",
		language: LanguageEnum.NorskBokmal,
	};
}

export function messageReducer(state: Message, action: MessageAction): Message {
	switch (action.type) {
		case "setValue": {
			const payload: SetValuePayload = action.payload;
			return {...state, ...payload};
		}
		case "setCheck": {
			const payload: SetChecksPayload = action.payload;

			const newState = {
				...state,
				checks: state.checks.map((check, index) =>
					index === action.checksIndex ? payload.check : check
				),
			};

			return newState;
		}
		case "reset":
			return getEmptyState();
		default:
			throw new Error(`Invalid action type '${action.type}' in form reducer.`);
	}
}
