import * as fc from "fast-check";
import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import {
  decodeMessageV1,
  decodeMessageV2,
  decodeV1,
  decodeV2,
  encodeV2,
  getEncodedAndDecodedMessage,
} from "./url-utils";

describe("Message encoder/decoder", () => {
  describe("V1", () => {
    it("should encode and decode a Message such that it stays the same", () => {
      const expectedMessage: Message = {
        date: "date",
        message: "message",
        name: "name",
        checks: [false, true, false],
        language: LanguageEnum.English,
        themeName: "winter",
      };

      const encodedMessage =
        "N4IgJghgLgpiBc5pwDQgLYwM5YgczkUx31RADsJMEKqyBjACxnoGssEBtAMwgBssMFFABOAVyG8BMALpo+EcnjGkaAUSV8AllkYg0UZpgBydGgHct5WCJABfIA";
      const actualMessage = decodeMessageV1(encodedMessage);

      expect(actualMessage).toEqual(expectedMessage);
    });

    it("should return null if an empty encoded string is provided (decodeMessage)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "";
      const actualMessage = decodeMessageV1(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if an empty encoded string is provided (decode)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "";
      const actualMessage = decodeV1<unknown>(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if the string decodes to something that's not an object", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "Ix";
      const actualMessage = decodeV1<unknown>(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if a malformed encoded string is provided", () => {
      const consoleError = console.error;
      console.error = () => undefined;

      const testResult = fc.assert(
        fc.property(fc.string({ minLength: 5 }), encodedMessage => {
          const expectedMessage: Message | null = null;

          const actualMessage = decodeMessageV1(encodedMessage);

          expect(actualMessage).toBe(expectedMessage);
        }),
      );

      console.error = consoleError;

      return testResult;
    });
  });

  describe("V2", () => {
    it("should encode and decode a Message such that it stays the same", () => {
      const expectedMessage: Message = {
        date: "date",
        message: "message",
        name: "name",
        checks: [false, true, false],
        language: LanguageEnum.English,
        themeName: "winter",
      };

      const encodedMessage = encodeV2(expectedMessage);
      const actualMessage = decodeMessageV2(encodedMessage);

      expect(actualMessage).toEqual(expectedMessage);
    });

    it("should return null if an empty encoded string is provided (decodeMessage)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "";
      const actualMessage = decodeMessageV2(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if an empty encoded string is provided (decode)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "";
      const actualMessage = decodeV2(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if an encoded string consisting of only whitespaces is provided (decode)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "    ";
      const actualMessage = decodeV2(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if a malformed encoded string is provided", () => {
      const consoleError = console.error;
      console.error = () => undefined;

      const encodedMessage = "!";
      const actualMessage = decodeV2(encodedMessage);

      expect(actualMessage).toBeNull();

      console.error = consoleError;
    });

    it("should support using | in the texts", () => {
      const message: Message = {
        date: "date|",
        message: "message|||",
        name: "name|||",
        checks: [true, true, true],
        language: LanguageEnum.English,
        themeName: "winter",
      };

      const encodedMessage = encodeV2(message);
      const actualMessage = decodeV2(encodedMessage);

      expect(actualMessage).toEqual(message);
    });
  });
});

describe(getEncodedAndDecodedMessage, () => {
  it("should return the encoded and decoded message if message V2 (n) is set", () => {
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

    const queryParams = new URLSearchParams();
    queryParams.set("n", encodedMessage);

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBe(encodedMessage);
    expect(actualDecodedMessage).toEqual(message);
  });

  it("should return the encoded and decoded message if message V1 (m) is set", () => {
    const message: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [true, true, true],
      language: LanguageEnum.English,
      themeName: "winter",
    };

    const encodedMessageV1 =
      "N4IgJghgLgpiBc5pwDQgLYwM5YgczkUx31RADsJMEKqyBjACxnoGssEBtKAJwFcYKXgKH8YAXTQAbCOTx9SNAKJypASyyMQaKM0wA5OjQDua8rB4gAvkA";
    const encodedMessageV2 =
      "CYQwLgpgPgthDO8QHNoDsRygUTcgNgJbwAWUA7oWpAE5Rg0Cu0Dz9TEQA";

    const queryParams = new URLSearchParams();
    queryParams.set("m", encodedMessageV1);

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBe(encodedMessageV2);
    expect(actualDecodedMessage).toEqual(message);
  });

  it("should return null if no message is set", () => {
    const queryParams = new URLSearchParams();

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();
  });

  it("should return null if the message is empty", () => {
    const queryParams = new URLSearchParams();
    queryParams.set("n", "");

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();
  });

  it("should return null if the V2 message is malformed", () => {
    const consoleError = console.error;
    console.error = () => undefined;

    const queryParams = new URLSearchParams();
    queryParams.set("n", "!");

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();

    console.error = consoleError;
  });

  it("should return null if the V1 message is malformed", () => {
    const consoleError = console.error;
    console.error = () => undefined;

    const queryParams = new URLSearchParams();
    queryParams.set("m", "Ix");

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();

    console.error = consoleError;
  });
});
