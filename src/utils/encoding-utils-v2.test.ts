import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import { decodeMessageV1 } from "./encoding-utils-v1";
import { decodeMessageV2, decodeV2, encodeV2 } from "./encoding-utils-v2";
import { getFallbackTheme } from "./theme-utils";

describe("Message encoder/decoder", () => {
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
      const actualMessage = decodeMessageV2(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if a malformed encoded string is provided", () => {
      const consoleError = console.error;
      console.error = () => undefined;

      const encodedMessage = "!";
      const actualMessage = decodeMessageV2(encodedMessage);

      expect(actualMessage).toBeNull();

      console.error = consoleError;
    });

    it("should return null if a malformed encoded string is provided", () => {
      const consoleError = console.error;
      console.error = () => undefined;

      const encodedMessage = "z%toLoc";
      const actualMessage = decodeMessageV2(encodedMessage);

      expect(actualMessage).toBeNull();

      console.error = consoleError;
    });

    it("should support using | in the texts", () => {
      const message: Message = {
        date: "date|",
        message: "message|||",
        name: "name|||",
        checks: [true, false, true],
        language: LanguageEnum.English,
        themeName: "winter",
      };

      const encodedMessage = encodeV2(message);
      const actualMessage = decodeV2(encodedMessage);

      expect(actualMessage).toEqual(message);
    });

    it("should handle encoded %2B values in encoded message", () => {
      const encodedMessage =
        "N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmRAEZ40ACAewDMWApKgOyxUMATxDkAtlHjwqAczpIQATTZYMLAA4YpUPmCgtxVWFMPCW1cwCMoaWhgB0LACoR%2BCFhzbqbASz6yLFQssmxsFJ4YvroUTipYhjT2LGhshgaAJuSA8H9iIHxUkvSSLIAAZDnkADb8soLy9ACiARW%2B8BC5aNCSAHIFCgIVFQC%2BQA";

      expect(() => decodeMessageV1(encodedMessage)).not.toThrow();
    });

    it("should fallback to the default theme if the themeName is not valid", () => {
      const message: Message = {
        date: "date",
        message: "message",
        name: "name",
        checks: [true, false, true],
        language: LanguageEnum.English,
        // @ts-expect-error This theme name should be invalid
        themeName: "invalid-theme",
      };

      const encodedMessage = encodeV2(message);
      const actualMessage = decodeV2(encodedMessage);

      expect(actualMessage?.themeName).toBe("pride");
    });

    it("should handle decoded strings with only one value", () => {
      const emptyMessage: Message = {
        date: "date",
        message: "",
        name: "",
        checks: [false, false, false],
        language: LanguageEnum.NorskBokmal,
        themeName: getFallbackTheme().name,
      };

      const encodedMessage = "CYQwLgpkA";
      const actualMessage = decodeV2(encodedMessage);

      expect(actualMessage).toEqual(emptyMessage);
    });
  });
});
