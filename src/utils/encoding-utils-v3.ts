import LZString from "lz-string";
import { LanguageEnum } from "../enums/Language";
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
    getEnumValueIndex(themeName, themesRecord),
    checksToDecimal(checks),
  ].join("|");

  return LZString.compressToEncodedURIComponent(comprisedData);
}

const parseLanguageByIndex = (indexStr: string | undefined): LanguageEnum => {
  if (!indexStr) {
    return defaultLanguage;
  }

  const index = Number.parseInt(indexStr, 10);

  return getEnumValueByIndex(index, LanguageEnum) ?? defaultLanguage;
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

export function decodeV3(encodedObj: string): Message | null {
  const hasObj = !!encodedObj?.trim();
  if (!hasObj) {
    return null;
  }

  let decoded: string | null = null;

  try {
    decoded = LZString.decompressFromEncodedURIComponent(encodedObj);
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      console.error(error.message);
      return null;
    }
  }

  if (!decoded) {
    console.error(`Invalid encoded object ${encodedObj}`);
    return null;
  }

  const [date, message, name, languageIndex, themeIndex, checksAsDecimal] =
    decoded.split("|");

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
  // biome-ignore lint/style/noParameterAssign: Replace encoded %2B with +
  encodedMessage = encodedMessage.replace(/%2B/g, "+");

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
