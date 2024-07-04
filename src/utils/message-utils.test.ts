import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import type { ThemeName } from "../types/ThemeName";
import { createEmptyMessage, isEmpty } from "./message-utils";

const defaultThemeName: ThemeName = "pride";

describe(isEmpty.name, () => {
  it("should return true if the provided Message is empty", () => {
    const message: Message = {
      date: "",
      message: "",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: defaultThemeName,
    };

    expect(isEmpty(message)).toBeTruthy();
  });

  it("should return false if date is tampered with", () => {
    const message: Message = {
      date: "test",
      message: "",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: defaultThemeName,
    };

    expect(isEmpty(message)).toBeFalsy();
  });

  it("should return false if message is tampered with", () => {
    const message: Message = {
      date: "",
      message: "test",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: defaultThemeName,
    };

    expect(isEmpty(message)).toBeFalsy();
  });

  it("should return false if name is tampered with", () => {
    const message: Message = {
      date: "",
      message: "",
      name: "test",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: defaultThemeName,
    };

    expect(isEmpty(message)).toBeFalsy();
  });

  it("should return false if checks are tampered with", () => {
    const message: Message = {
      date: "",
      message: "",
      name: "",
      checks: [true, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: defaultThemeName,
    };

    expect(isEmpty(message)).toBeFalsy();
  });

  it("should return false if language is tampered with", () => {
    const message: Message = {
      date: "",
      message: "",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.English,
      themeName: defaultThemeName,
    };

    expect(isEmpty(message)).toBeFalsy();
  });

  it("should return false if themeName is tampered with", () => {
    const message: Message = {
      date: "",
      message: "",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: "winter",
    };

    expect(isEmpty(message)).toBeFalsy();
  });

  it("should throw an error if a property is of an unknown type", () => {
    const message = {
      date: new Date(),
      message: "",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: "winter",
    } as unknown as Message;

    expect(() => isEmpty(message)).toThrow();
  });

  it("should throw an error if a property within an array is not primitive", () => {
    const message = {
      date: "",
      message: "",
      name: "",
      checks: [{}, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: "winter",
    } as unknown as Message;

    expect(() => isEmpty(message)).toThrow();
  });

  it("should support numbers", () => {
    const message = {
      date: 2,
      message: "",
      name: "",
      checks: [1, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: "winter",
    } as unknown as Message;

    expect(() => isEmpty(message)).not.toThrow();
  });
});

describe(createEmptyMessage.name, () => {
  it("should return an empty message", () => {
    const actualMessage = createEmptyMessage();
    const expectedMessage: Message = {
      date: "",
      message: "",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: defaultThemeName,
    };

    expect(actualMessage).toEqual(expectedMessage);
    expect(isEmpty(actualMessage)).toBeTruthy();
  });
});
