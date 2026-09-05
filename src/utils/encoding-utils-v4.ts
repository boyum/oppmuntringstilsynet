import pako from "pako";
import { Language } from "../enums/Language";
import type { Checks } from "../types/Checks";
import type { Message } from "../types/Message";
import { ThemeName } from "../types/ThemeName";
import { themes } from "../types/Themes";
import { defaultLanguage } from "./language-utils";
import { getFallbackTheme } from "./theme-utils";

const sanitizeString = <T extends string | undefined>(
  str: T,
): T extends string ? string : undefined => {
  return str?.replace(/\|/g, "%7C") as T extends string ? string : undefined;
};

const desanitizeString = (str: string | undefined): string => {
  if (!str) {
    return "";
  }

  return str.replace(/%7C/g, "|");
};

const getEnumValueIndex = <T extends string>(
  value: T,
  enumObject: Record<string, string>,
): number => {
  return Object.values(enumObject).indexOf(value);
};

const getEnumValueByIndex = <T extends string>(
  index: number,
  enumObject: Record<string, string>,
): T => {
  return Object.values(enumObject)[index] as T;
};

const binaryToDecimal = (binary: string): number => {
  return Number.parseInt(binary, 2);
};

const decimalToBinary = (decimal: number): string => {
  return decimal.toString(2);
};

const checksToBinary = (checks: Checks): string => {
  return checks.map(check => (check ? "1" : "0")).join("");
};

const checksToDecimal = (checks: Checks): number => {
  return binaryToDecimal(checksToBinary(checks));
};

const themesRecord = themes.reduce(
  (acc, theme) => {
    acc[theme.name] = theme.name;
    return acc;
  },
  {} as Record<string, ThemeName>,
);

/**
 * Convert a Uint8Array to a base64url-encoded string (URL-safe)
 * Base64URL replaces: + with -, / with _, and removes padding =
 */
const toBase64UrlSafe = (data: Uint8Array): string => {
  // Node.js environment
  if (typeof Buffer !== "undefined") {
    return Buffer.from(data)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  // Browser environment
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

/**
 * Convert a base64url-encoded string back to a Uint8Array
 */
const fromBase64UrlSafe = (str: string): Uint8Array => {
  // Restore standard base64 format
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // Restore padding
  const padding = (4 - (base64.length % 4)) % 4;
  base64 += "=".repeat(padding);

  // Node.js environment
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }

  // Browser environment
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export function encodeV4({
  date,
  message,
  name,
  checks,
  language,
  themeName,
}: Message): string {
  const comprisedData = [
    sanitizeString(date),
    sanitizeString(message),
    sanitizeString(name),
    getEnumValueIndex(language, Language),
    getEnumValueIndex(themeName, themesRecord),
    checksToDecimal(checks),
  ].join("|");

  // Compress using deflateRaw (no headers/checksums for smaller output)
  const compressed = pako.deflateRaw(comprisedData, { level: 9 });

  // Convert to base64url (URL-safe)
  return toBase64UrlSafe(compressed);
}

const parseLanguageByIndex = (indexStr: string | undefined): Language => {
  if (!indexStr) {
    return defaultLanguage;
  }

  const index = Number.parseInt(indexStr, 10);

  return getEnumValueByIndex(index, Language) ?? defaultLanguage;
};

const parseThemeByIndex = (indexStr: string | undefined): ThemeName => {
  if (!indexStr) {
    return getFallbackTheme().name;
  }

  const index = Number.parseInt(indexStr, 10);
  return themes[index]?.name ?? getFallbackTheme().name;
};

const parseChecks = (checks: string | undefined): Checks => {
  if (!checks) {
    return [false, false, false];
  }

  return decimalToBinary(Number.parseInt(checks, 10))
    .padStart(3, "0")
    .split("")
    .map(check => check === "1") as Checks;
};

export function decodeV4(encodedObj: string): Message | null {
  const hasObj = !!encodedObj?.trim();
  if (!hasObj) {
    return null;
  }

  let decoded: string;

  try {
    // Convert from base64url back to binary
    const compressed = fromBase64UrlSafe(encodedObj);

    // Decompress using inflateRaw
    decoded = pako.inflateRaw(compressed, { to: "string" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return null;
  }

  if (!decoded) {
    console.error(`Invalid encoded object ${encodedObj}`);
    return null;
  }

  const [date, message, name, languageIndex, themeIndex, checksAsDecimal] =
    decoded.split("|");

  // Validate that we have at least the minimum required fields
  if (
    !date &&
    !message &&
    !name &&
    !languageIndex &&
    !themeIndex &&
    !checksAsDecimal
  ) {
    console.error(`Invalid decoded data structure`);
    return null;
  }

  const language = parseLanguageByIndex(languageIndex);
  const themeName = parseThemeByIndex(themeIndex);
  const checks = parseChecks(checksAsDecimal);

  return {
    date: desanitizeString(date),
    message: desanitizeString(message),
    name: desanitizeString(name),
    language,
    themeName,
    checks,
  };
}

export function decodeMessageV4(encodedMessage: string): Message | null {
  const hasMessage = !!encodedMessage?.trim();
  if (!hasMessage) {
    return null;
  }

  const defaultValuesForBackwardsCompatibility = {
    language: Language.NorskBokmal,
  };

  const decodedMessage = decodeV4(encodedMessage);
  if (!decodedMessage) {
    return null;
  }

  return {
    ...defaultValuesForBackwardsCompatibility,
    ...decodedMessage,
  };
}
