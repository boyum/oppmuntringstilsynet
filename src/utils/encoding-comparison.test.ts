import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import { encodeV3 } from "./encoding-utils-v3";
import { encodeV4 } from "./encoding-utils-v4";

describe("V3 vs V4 Encoding Comparison", () => {
  it("should produce shorter URLs with V4 for short messages", () => {
    const message: Message = {
      date: "2025-11-06",
      message: "Great job!",
      name: "John",
      checks: [true, false, true],
      language: Language.English,
      themeName: "winter",
    };

    const v3Encoded = encodeV3(message);
    const v4Encoded = encodeV4(message);

    console.log(`V3 length: ${v3Encoded.length} chars`);
    console.log(`V4 length: ${v4Encoded.length} chars`);
    console.log(`Savings: ${v3Encoded.length - v4Encoded.length} chars (${Math.round((1 - v4Encoded.length / v3Encoded.length) * 100)}%)`);

    expect(v4Encoded.length).toBeLessThan(v3Encoded.length);
  });

  it("should produce shorter URLs with V4 for medium messages", () => {
    const message: Message = {
      date: "2025-11-06",
      message:
        "This is a much longer message to test how compression works with more text. The more text we have, the better compression algorithms should perform.",
      name: "Alice Smith-Johnson",
      checks: [true, true, true],
      language: Language.NorskBokmal,
      themeName: "pride",
    };

    const v3Encoded = encodeV3(message);
    const v4Encoded = encodeV4(message);

    console.log(`V3 length: ${v3Encoded.length} chars`);
    console.log(`V4 length: ${v4Encoded.length} chars`);
    console.log(`Savings: ${v3Encoded.length - v4Encoded.length} chars (${Math.round((1 - v4Encoded.length / v3Encoded.length) * 100)}%)`);

    expect(v4Encoded.length).toBeLessThan(v3Encoded.length);
  });

  it("should produce shorter URLs with V4 for long messages", () => {
    const message: Message = {
      date: "2025-11-06",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      name: "Bob Anderson",
      checks: [false, true, false],
      language: Language.NorskNynorsk,
      themeName: "winter",
    };

    const v3Encoded = encodeV3(message);
    const v4Encoded = encodeV4(message);

    console.log(`V3 length: ${v3Encoded.length} chars`);
    console.log(`V4 length: ${v4Encoded.length} chars`);
    console.log(`Savings: ${v3Encoded.length - v4Encoded.length} chars (${Math.round((1 - v4Encoded.length / v3Encoded.length) * 100)}%)`);

    expect(v4Encoded.length).toBeLessThan(v3Encoded.length);
  });

  it("should produce shorter URLs with V4 for messages with Norwegian characters", () => {
    const message: Message = {
      date: "2025-11-06",
      message: "Hei! Dette er en melding med æ, ø og å. Veldig bra jobbet!",
      name: "Ærlig Øystein Ålvik",
      checks: [true, false, true],
      language: Language.NorskBokmal,
      themeName: "winter",
    };

    const v3Encoded = encodeV3(message);
    const v4Encoded = encodeV4(message);

    console.log(`V3 length: ${v3Encoded.length} chars`);
    console.log(`V4 length: ${v4Encoded.length} chars`);
    console.log(`Savings: ${v3Encoded.length - v4Encoded.length} chars (${Math.round((1 - v4Encoded.length / v3Encoded.length) * 100)}%)`);

    expect(v4Encoded.length).toBeLessThan(v3Encoded.length);
  });
});
