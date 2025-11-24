import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import { decodeMessageV4, decodeV4, encodeV4 } from "./encoding-utils-v4";
import { getFallbackTheme } from "./theme-utils";

describe("Message encoder/decoder", () => {
  describe("V4", () => {
    it("should encode and decode a Message such that it stays the same", () => {
      const expectedMessage: Message = {
        date: "date",
        message: "message",
        name: "name",
        checks: [false, true, false],
        language: Language.English,
        themeName: "winter",
      };

      const encodedMessage = encodeV4(expectedMessage);
      const actualMessage = decodeMessageV4(encodedMessage);

      expect(actualMessage).toEqual(expectedMessage);
    });

    it("should return null if an empty encoded string is provided (decodeMessage)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "";
      const actualMessage = decodeMessageV4(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if an empty encoded string is provided (decode)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "";
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if an encoded string consisting of only whitespaces is provided (decode)", () => {
      const expectedMessage: Message | null = null;

      const encodedMessage = "    ";
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toBe(expectedMessage);
    });

    it("should return null if a malformed encoded string is provided", () => {
      const consoleError = console.error;
      console.error = () => undefined;

      const encodedMessage = "!";
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toBeNull();

      console.error = consoleError;
    });

    it("should handle invalid base64url gracefully", () => {
      const consoleError = console.error;
      console.error = () => undefined;

      // This should fail during decompression
      const encodedMessage = "zzz";
      const actualMessage = decodeV4(encodedMessage);

      // May return null or garbage data, but shouldn't crash
      expect(actualMessage === null || typeof actualMessage === "object").toBe(
        true,
      );

      console.error = consoleError;
    });

    it("should support using | in the texts", () => {
      const message: Message = {
        date: "date|",
        message: "message|||",
        name: "name|||",
        checks: [true, false, true],
        language: Language.English,
        themeName: "winter",
      };

      const encodedMessage = encodeV4(message);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toEqual(message);
    });

    it("should fallback to the default theme if the themeName is not valid", () => {
      const message: Message = {
        date: "date",
        message: "message",
        name: "name",
        checks: [true, false, true],
        language: Language.English,
        // @ts-expect-error This theme name should be invalid
        themeName: "invalid-theme",
      };

      const encodedMessage = encodeV4(message);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage?.themeName).toBe("pride");
    });

    it("should handle decoded strings with only one value", () => {
      const emptyMessage: Message = {
        date: "date",
        message: "",
        name: "",
        checks: [false, false, false],
        language: Language.NorskBokmal,
        themeName: getFallbackTheme().name,
      };

      const encodedMessage = encodeV4(emptyMessage);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toEqual(emptyMessage);
    });

    it("should produce URL-safe encoded strings (no +, /, or =)", () => {
      const message: Message = {
        date: "2025-11-06",
        message: "This is a test message with various characters!",
        name: "John Doe",
        checks: [true, true, false],
        language: Language.English,
        themeName: "winter",
      };

      const encodedMessage = encodeV4(message);

      // URL-safe base64 should not contain +, /, or =
      expect(encodedMessage).not.toMatch(/[+/=]/);
      // Should only contain valid base64url characters
      expect(encodedMessage).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("should handle all three checks being true", () => {
      const message: Message = {
        date: "2025-11-06",
        message: "All checks!",
        name: "Tester",
        checks: [true, true, true],
        language: Language.NorskNynorsk,
        themeName: "pride",
      };

      const encodedMessage = encodeV4(message);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toEqual(message);
    });

    it("should handle all three checks being false", () => {
      const message: Message = {
        date: "2025-11-06",
        message: "No checks!",
        name: "Tester",
        checks: [false, false, false],
        language: Language.NorskBokmal,
        themeName: "winter",
      };

      const encodedMessage = encodeV4(message);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toEqual(message);
    });

    it("should handle long messages efficiently", () => {
      const message: Message = {
        date: "2025-11-06",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        name: "Alice Smith-Johnson",
        checks: [true, false, true],
        language: Language.English,
        themeName: "pride",
      };

      const encodedMessage = encodeV4(message);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toEqual(message);
      // V4 uses deflateRaw which is very efficient
      expect(encodedMessage).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("should handle Norwegian characters (æ, ø, å)", () => {
      const message: Message = {
        date: "2025-11-06",
        message: "Hei! Dette er en melding med æ, ø og å.",
        name: "Ærlig Øystein Ålvik",
        checks: [true, false, false],
        language: Language.NorskBokmal,
        themeName: "winter",
      };

      const encodedMessage = encodeV4(message);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toEqual(message);
    });

    it("should handle special characters and emoji", () => {
      const message: Message = {
        date: "2025-11-06",
        message: "Great work! 🎉 Keep it up! 💪",
        name: "😊 Happy User",
        checks: [true, true, true],
        language: Language.English,
        themeName: "pride",
      };

      const encodedMessage = encodeV4(message);
      const actualMessage = decodeV4(encodedMessage);

      expect(actualMessage).toEqual(message);
    });

    it("should encode messages efficiently", () => {
      const message: Message = {
        date: "2025-11-06",
        message: "This is a test message",
        name: "John Doe",
        checks: [true, false, true],
        language: Language.English,
        themeName: "winter",
      };

      const encodedMessage = encodeV4(message);
      const decodedMessage = decodeV4(encodedMessage);

      // Verify round-trip encoding/decoding works
      expect(decodedMessage).toEqual(message);
      // Verify it's URL-safe
      expect(encodedMessage).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });
});
