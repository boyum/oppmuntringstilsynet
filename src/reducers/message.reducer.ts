import { LanguageEnum } from "../enums/Language";
import { Message } from "../types/Message";

export enum MessageActionType {
  SetMessage = "setMessage",
  SetCheck = "setCheck",
  SetTheme = "setTheme",
  ResetEverythingButTheme = "reset",
}

export type MessageAction =
  | {
      type: MessageActionType.SetMessage;
      message: Partial<Message>;
    }
  | {
      type: MessageActionType.SetTheme;
      themeName: string;
    }
  | {
      type: MessageActionType.SetCheck;
      checkIndex: number;
      check: boolean;
    }
  | {
      type: MessageActionType.ResetEverythingButTheme;
    };

export function getEmptyState(): Message {
  return {
    checks: [false, false, false],
    date: "",
    message: "",
    name: "",
    language: LanguageEnum.NorskBokmal,
    themeName: "",
  };
}

export function messageReducer(state: Message, action: MessageAction): Message {
  switch (action.type) {
    case MessageActionType.SetMessage: {
      const { message } = action;

      return { ...state, ...message };
    }

    case MessageActionType.SetCheck: {
      const newState = {
        ...state,
        checks: state.checks.map((check, index) =>
          index === action.checkIndex ? action.check : check,
        ) as [boolean, boolean, boolean],
      };

      return newState;
    }

    case MessageActionType.SetTheme: {
      const { themeName } = action;

      return {
        ...state,
        themeName,
      };
    }

    case MessageActionType.ResetEverythingButTheme:
      return {
        ...getEmptyState(),
        themeName: state.themeName,
      };
  }
}
