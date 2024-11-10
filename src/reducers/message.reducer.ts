import { Language } from "../enums/Language";
import type { Checks } from "../types/Checks";
import type { Message } from "../types/Message";
import type { ThemeName } from "../types/ThemeName";
import { getFallbackTheme } from "../utils/theme-utils";

export enum MessageAction {
  SetMessage = "setMessage",
  SetCheck = "setCheck",
  SetTheme = "setTheme",
  ResetEverythingButTheme = "reset",
}

export type MessageActionType =
  | {
      type: MessageAction.SetMessage;
      message: Partial<Message>;
    }
  | {
      type: MessageAction.SetTheme;
      themeName: ThemeName;
    }
  | {
      type: MessageAction.SetCheck;
      checkIndex: number;
      check: boolean;
    }
  | {
      type: MessageAction.ResetEverythingButTheme;
    };

/**
 * Only use this for comparing to see if a message is empty.
 */
export const emptyMessage_DO_NOT_USE: Message = {
  checks: [false, false, false],
  date: "",
  message: "",
  name: "",
  language: Language.NorskBokmal,
  themeName: getFallbackTheme().name,
};

export function getEmptyState(): Message {
  return JSON.parse(JSON.stringify(emptyMessage_DO_NOT_USE));
}

export function messageReducer(
  state: Message,
  action: MessageActionType,
): Message {
  switch (action.type) {
    case MessageAction.SetMessage: {
      const { message } = action;

      return { ...state, ...message };
    }

    case MessageAction.SetCheck: {
      const newState = {
        ...state,
        checks: state.checks.map((check, index) =>
          index === action.checkIndex ? action.check : check,
        ) as Checks,
      };

      return newState;
    }

    case MessageAction.SetTheme: {
      const { themeName } = action;

      return {
        ...state,
        themeName,
      };
    }

    case MessageAction.ResetEverythingButTheme:
      return {
        ...getEmptyState(),
        themeName: state.themeName,
      };
  }
}
