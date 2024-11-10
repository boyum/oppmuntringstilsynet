import LZString from "lz-string";
import { Language } from "../enums/Language";
import type { Checks } from "../types/Checks";
import type { Message } from "../types/Message";
import { defaultLanguage, isLanguage } from "./language-utils";
import { getFallbackTheme, isThemeName } from "./theme-utils";

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

export function encodeV2({
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
    sanitizeString(language),
    sanitizeString(themeName),
    checks.join("|"),
  ].join("|");

  return LZString.compressToEncodedURIComponent(comprisedData);
}

export function decodeV2(encodedObj: string): Message | null {
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

  const [date, message, name, language, themeName, ...checks] =
    decoded.split("|");

  let lang = defaultLanguage;
  const desanitizedLanguage = desanitizeString(language);
  if (isLanguage(desanitizedLanguage)) {
    lang = desanitizedLanguage;
  }

  let theme = getFallbackTheme().name;
  const desanitizedThemeName = desanitizeString(themeName);
  if (isThemeName(desanitizedThemeName)) {
    theme = desanitizedThemeName;
  }

  return {
    date: desanitizeString(date),
    message: desanitizeString(message),
    name: desanitizeString(name),
    language: lang,
    themeName: theme,
    checks: Array.from({ length: 3 }).map(
      (_, index) => checks[index] === "true",
    ) as Checks,
  };
}

export function decodeMessageV2(encodedMessage: string): Message | null {
  // biome-ignore lint/style/noParameterAssign: Replace encoded %2B with +
  encodedMessage = encodedMessage.replace(/%2B/g, "+");

  const hasMessage = !!encodedMessage?.trim();
  if (!hasMessage) {
    return null;
  }

  const decodedMessage = decodeV2(encodedMessage);
  if (!decodedMessage) {
    return null;
  }

  const defaultValuesForBackwardsCompatibility = {
    language: Language.NorskBokmal,
  };

  return {
    ...defaultValuesForBackwardsCompatibility,
    ...decodedMessage,
  };
}
