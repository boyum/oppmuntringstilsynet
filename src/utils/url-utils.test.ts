import * as fc from "fast-check";
import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import { decode, decodeMessage, encode } from "./url-utils";

describe("Message encoder/decoder", () => {
  it("should encode and decode a Message such that it stays the same", () => {
    const expectedMessage: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [false, true, false],
      language: LanguageEnum.English,
      themeName: "winter",
    };

    const encodedMessage = encode(expectedMessage);
    const actualMessage = decodeMessage(encodedMessage);

    expect(actualMessage).toEqual(expectedMessage);
  });

  it("should return null if an empty encoded string is provided (decodeMessage)", () => {
    const expectedMessage: Message | null = null;

    const encodedMessage = "";
    const actualMessage = decodeMessage(encodedMessage);

    expect(actualMessage).toBe(expectedMessage);
  });

  it("should return null if an empty encoded string is provided (decode)", () => {
    const expectedMessage: Message | null = null;

    const encodedMessage = "";
    const actualMessage = decode<unknown>(encodedMessage);

    expect(actualMessage).toBe(expectedMessage);
  });

  it("should return null if the string decodes to something that's not an object", () => {
    const expectedMessage: Message | null = null;

    const encodedMessage = "Ix";
    const actualMessage = decode<unknown>(encodedMessage);

    expect(actualMessage).toBe(expectedMessage);
  });

  it("should return null if a malformed encoded string is provided", () =>
    fc.assert(
      fc.property(fc.string({ minLength: 5 }), encodedMessage => {
        const expectedMessage: Message | null = null;

        const actualMessage = decodeMessage(encodedMessage);

        expect(actualMessage).toBe(expectedMessage);
      }),
    ));
});
