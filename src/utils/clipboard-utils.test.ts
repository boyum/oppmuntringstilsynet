import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import { copyToClipboard, createMessageUrl } from "./clipboard-utils";

describe(copyToClipboard.name, () => {
  it("should copy the element's value to the clipboard", () => {
    const inputElement = document.createElement("input");
    const inputValue = "test";

    document.execCommand = jest.fn();
    copyToClipboard(inputElement, inputValue);

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(inputElement.value).toBe(inputValue);
  });
});

describe(createMessageUrl.name, () => {
  it("should create a url with the encoded message as a get parameter", () => {
    const message: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [true, true, true],
      language: LanguageEnum.English,
      themeName: "winter",
    };

    const encodedMessage =
      "CYQwLgpgPgthDO8QHNoDsRygUTcgNgJbwAWUA7oWpAE5Rg0Cu0Dz9TEQA";
    const currentPath = "https://example.com";

    const url = createMessageUrl(message, currentPath);

    expect(url.href).toBe(`${currentPath}/?n=${encodedMessage}`);
  });

  it("should replace the message in the current url with the new encodedMessage", () => {
    const message: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [true, true, true],
      language: LanguageEnum.English,
      themeName: "winter",
    };

    const encodedMessage =
      "CYQwLgpgPgthDO8QHNoDsRygUTcgNgJbwAWUA7oWpAE5Rg0Cu0Dz9TEQA";
    const currentPath = "https://example.com";

    const url = createMessageUrl(message, `${currentPath}?n=message`);

    expect(url.href).toBe(`${currentPath}/?n=${encodedMessage}`);
  });
});
