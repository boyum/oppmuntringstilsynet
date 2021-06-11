import LanguageEnum from "../enums/Language";
import Message from "../types/Message";
import {
  getEmptyState,
  MessageAction,
  MessageActionType,
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
    const defaultLanguage = LanguageEnum.NorskBokmal;

    expect(message.language).toBe(defaultLanguage);
  });

  it("should return an empty Message with no theme set", () => {
    expect(message.themeName).toBe("");
  });
});

describe(messageReducer.name, () => {
  let defaultState: Message;

  beforeEach(() => {
    defaultState = getEmptyState();
  });

  describe("SetMessage", () => {
    it("should set message value", () => {
      const message: Message = {
        date: "date",
        language: LanguageEnum.NorskNynorsk,
        message: "message",
        name: "name",
        themeName: "themeName",
        checks: [true, false, true],
      };

      const action: MessageAction = {
        message,
        type: MessageActionType.SetMessage,
      };

      const newState = messageReducer(defaultState, action);

      expect(newState).toEqual(message);
    });
  });

  describe("SetCheck", () => {
    it("should set the check with the given index", () => {
      const index = 0;
      const checkValue = true;

      const action: MessageAction = {
        type: MessageActionType.SetCheck,
        check: checkValue,
        checkIndex: index,
      };

      const newState = messageReducer(defaultState, action);
      expect(newState.checks[index]).toBe(checkValue);
    });
  });

  describe("SetTheme", () => {
    it("should set the message's theme", () => {
      const theme = "my-theme";

      const action: MessageAction = {
        type: MessageActionType.SetTheme,
        themeName: theme,
      };

      const newState = messageReducer(defaultState, action);
      expect(newState.themeName).toBe(theme);
    });
  });

  describe("Reset", () => {
    it("should reset the message and return an empty state", () => {
      const state: Message = {
        date: "date",
        language: LanguageEnum.NorskNynorsk,
        message: "message",
        name: "name",
        themeName: "themeName",
        checks: [true, false, true],
      };

      const action: MessageAction = {
        type: MessageActionType.Reset,
      };

      const newState = messageReducer(state, action);

      expect(newState).toEqual(getEmptyState());
    });
  });
});
