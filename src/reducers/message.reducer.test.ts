import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import type { ThemeName } from "../types/ThemeName";
import { defaultLanguage } from "../utils/language-utils";
import {
  MessageAction,
  MessageActionType,
  getEmptyState,
  messageReducer,
} from "./message.reducer";

describe(getEmptyState.name, () => {
  let message: Message;

  beforeEach(() => {
    message = getEmptyState();
  });

  it("should return an empty Message with no checks set", () => {
    const allChecksAreUnchecked = message.checks.every(
      check => check === false,
    );
    expect(allChecksAreUnchecked).toBeTruthy();
  });

  it("should return an empty Message with empty form fields", () => {
    expect(message.date).toBe("");
    expect(message.message).toBe("");
    expect(message.name).toBe("");
  });

  it("should return an empty Message with default language set", () => {
    expect(message.language).toBe(defaultLanguage);
  });

  it("should return an empty Message with the fallback theme set", () => {
    expect(message.themeName).toBe("pride");
  });
});

describe(messageReducer.name, () => {
  let defaultState: Message;

  beforeEach(() => {
    defaultState = getEmptyState();
  });

  describe(MessageAction.SetMessage, () => {
    it("should set message value", () => {
      const message: Message = {
        date: "date",
        language: Language.NorskNynorsk,
        message: "message",
        name: "name",
        themeName: "winter",
        checks: [true, false, true],
      };

      const action: MessageActionType = {
        message,
        type: MessageAction.SetMessage,
      };

      const newState = messageReducer(defaultState, action);

      expect(newState).toEqual(message);
    });
  });

  describe(MessageAction.SetCheck, () => {
    it("should set the check with the given index", () => {
      const index = 0;
      const checkValue = true;

      const action: MessageActionType = {
        type: MessageAction.SetCheck,
        check: checkValue,
        checkIndex: index,
      };

      const newState = messageReducer(defaultState, action);
      expect(newState.checks[index]).toBe(checkValue);
    });
  });

  describe(MessageAction.SetTheme, () => {
    it("should set the message's theme", () => {
      const theme: ThemeName = "winter";

      const action: MessageActionType = {
        type: MessageAction.SetTheme,
        themeName: theme,
      };

      const newState = messageReducer(defaultState, action);
      expect(newState.themeName).toBe(theme);
    });
  });

  describe("Reset everything but theme", () => {
    it("should reset the message and return an empty state, and keep the current theme", () => {
      const themeName: ThemeName = "winter";
      const state: Message = {
        date: "date",
        language: Language.NorskNynorsk,
        message: "message",
        name: "name",
        themeName,
        checks: [true, false, true],
      };

      const action: MessageActionType = {
        type: MessageAction.ResetEverythingButTheme,
      };

      const newState = messageReducer(state, action);
      const expectedState = {
        ...getEmptyState(),
        themeName,
      };

      expect(newState).toEqual(expectedState);
    });
  });
});
