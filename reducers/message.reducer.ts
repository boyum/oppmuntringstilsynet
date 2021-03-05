import LanguageEnum from "../enums/Language";
import Message from "../types/Message";

export type SetValuePayload = {
  date?: string;
  message?: string;
  checks?: boolean[];
  name?: string;
  language?: LanguageEnum;
};

export type SetChecksPayload = {
  check: boolean;
};

export type MessageAction = {
  type: "setValue" | "setCheck" | "setTheme" | "reset";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    themeName: null,
  };
}

export function messageReducer(state: Message, action: MessageAction): Message {
  switch (action.type) {
    case "setValue": {
      const { payload } = action;
      return { ...state, ...payload };
    }
    case "setCheck": {
      const { payload } = action;

      const newState = {
        ...state,
        checks: state.checks.map((check, index) =>
          index === action.checksIndex ? payload.check : check,
        ),
      };

      return newState;
    }
    case "setTheme": {
      const { payload } = action;

      return {
        ...state,
        themeName: payload,
      };
    }
    case "reset":
      return getEmptyState();
    default:
      throw new Error(`Invalid action type '${action.type}' in form reducer.`);
  }
}
