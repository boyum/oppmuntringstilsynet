import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import { ThemeName } from "../types/ThemeName";
import { themes } from "../types/Themes";
import { defaultLanguage } from "./language-utils";
import { getFallbackTheme } from "./theme-utils";

const URL_SAFE_CHARACTER_SET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz._-*'";
const BASE = URL_SAFE_CHARACTER_SET.length;

function urlSafeEncodeString(str: string): string {
  let num = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    num = (num << BigInt(8)) + BigInt(str.charCodeAt(i));
  }

  let result = "";
  while (num > 0) {
    result = URL_SAFE_CHARACTER_SET[Number(num % BigInt(BASE))] + result;
    num /= BigInt(BASE);
  }

  return result || (URL_SAFE_CHARACTER_SET[0] ?? "");
}

function urlSafeDecodeString(encodedStr: string): string {
  let num = BigInt(0);
  for (let i = 0; i < encodedStr.length; i++) {
    num =
      num * BigInt(BASE) +
      BigInt(URL_SAFE_CHARACTER_SET.indexOf(encodedStr[i]!));
  }

  let result = "";
  while (num > 0) {
    result = String.fromCharCode(Number(num & BigInt(0xff))) + result;
    num >>= BigInt(8);
  }

  return result;
}

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

export function encodeV3({
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
    getEnumValueIndex(language, LanguageEnum),
    getEnumValueIndex(
      themeName,
      themes.reduce(
        (acc, theme) => {
          acc[theme.name] = theme.name;
          return acc;
        },
        {} as Record<string, string>,
      ),
    ),
    Number.parseInt(checks.map(check => (check ? "1" : "0")).join(""), 2),
  ].join("|");

  return urlSafeEncodeString(comprisedData);
}

const parseLanguageByIndex = (indexStr: string | undefined): LanguageEnum => {
  if (!indexStr) {
    return defaultLanguage;
  }

  const index = parseInt(indexStr, 10);

  return getEnumValueByIndex(index, LanguageEnum) ?? defaultLanguage;
};

const parseThemeByIndex = (indexStr: string | undefined): ThemeName => {
  if (!indexStr) {
    return getFallbackTheme().name;
  }

  const index = parseInt(indexStr, 10);
  return themes[index]?.name ?? getFallbackTheme().name;
};

const parseChecks = (
  checks: string | undefined,
): [boolean, boolean, boolean] => {
  if (!checks) {
    return [false, false, false];
  }

  return Number.parseInt(checks, 10)
    .toString(2)
    .padStart(3, "0")
    .split("")
    .map(check => check === "1") as [boolean, boolean, boolean];
};

export function decodeV3(encodedMessage: string): Message | null {
  const hasObj = !!encodedMessage?.trim();
  if (!hasObj) {
    return null;
  }

  const decodedMessage = urlSafeDecodeString(encodedMessage);

  if (!decodedMessage) {
    console.error(`Invalid encoded object ${encodedMessage}`);
    return null;
  }

  const [date, message, name, languageIndex, themeIndex, checksAsDecimal] =
    decodedMessage.split("|");

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

export function decodeMessageV3(encodedMessage: string): Message | null {
  const hasMessage = !!encodedMessage?.trim();
  if (!hasMessage) {
    return null;
  }

  const defaultValuesForBackwardsCompatibility = {
    language: LanguageEnum.NorskBokmal,
  };

  const decodedMessage = decodeV3(encodedMessage);
  if (!decodedMessage) {
    return null;
  }

  return {
    ...defaultValuesForBackwardsCompatibility,
    ...decodedMessage,
  };
}
