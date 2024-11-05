import LZString from "lz-string";
import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import { ThemeName } from "../types/ThemeName";
import { isThemeName } from "./theme-utils";

const sanitizeString = <T extends string | undefined>(
  str: T,
): T extends string ? string : undefined => {
  return str?.replace(/\|/g, "%7C") as T extends string ? string : undefined;
};

const desanitizeString = (str: string): string => {
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

  return {
    date: desanitizeString(date ?? ""),
    message: desanitizeString(message ?? ""),
    name: desanitizeString(name ?? ""),
    language: desanitizeString(language ?? "") as LanguageEnum,
    themeName: isThemeName(desanitizeString(themeName ?? ""))
      ? (desanitizeString(themeName ?? "") as ThemeName)
      : "pride",
    checks: checks.map(check => check === "true") as [
      boolean,
      boolean,
      boolean,
    ],
  };
}

export function decodeMessageV2(encodedMessage: string): Message | null {
  // biome-ignore lint/style/noParameterAssign: Replace encoded %2B with +
  encodedMessage = encodedMessage.replace(/%2B/g, "+");

  const hasMessage = !!encodedMessage?.trim();
  if (!hasMessage) {
    return null;
  }

  const defaultValuesForBackwardsCompatibility = {
    language: LanguageEnum.NorskBokmal,
  };

  const decodedMessage = decodeV2(encodedMessage);
  if (!decodedMessage) {
    return null;
  }

  return {
    ...defaultValuesForBackwardsCompatibility,
    ...decodedMessage,
  };
}
