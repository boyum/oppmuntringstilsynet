import { LanguageEnum } from "../enums/Language";
import { Message } from "../types/Message";
import { createEmptyMessage, isEmpty } from "./message-utils";

describe(isEmpty.name, () => {
  it("should return true if the provided Message is empty", () => {
    const message: Message = {
      date: "",
      message: "",
      name: "",
      checks: [false, false, false],
      language: LanguageEnum.NorskBokmal,
      themeName: "",
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
      themeName: "",
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
      themeName: "",
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
      themeName: "",
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
      themeName: "",
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
      themeName: "",
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
      themeName: "test",
    };

    expect(isEmpty(message)).toBeFalsy();
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
      themeName: "",
    };

    expect(actualMessage).toEqual(expectedMessage);
    expect(isEmpty(actualMessage)).toBeTruthy();
  });
});
