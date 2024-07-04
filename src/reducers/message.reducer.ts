import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import type { ThemeName } from "../types/ThemeName";
import { getFallbackTheme } from "../utils/theme-utils";

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
      themeName: ThemeName;
    }
  | {
      type: MessageActionType.SetCheck;
      checkIndex: number;
      check: boolean;
    }
  | {
      type: MessageActionType.ResetEverythingButTheme;
    };

/**
 * Only use this for comparing to see if a message is empty.
 */
export const emptyMessage_DO_NOT_USE: Message = {
  checks: [false, false, false],
  date: "",
  message: "",
  name: "",
  language: LanguageEnum.NorskBokmal,
  themeName: getFallbackTheme().name,
};

export function getEmptyState(): Message {
  return global.structuredClone(emptyMessage_DO_NOT_USE);
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
