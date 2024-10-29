import LZString from "lz-string";
import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";
import { isThemeName } from "./theme-utils";
import { ThemeName } from "../types/ThemeName";

export function decodeV1<Type>(encodedObj: string): Type | null {
  const hasObj = !!encodedObj;

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

  let parsed: Type | null = null;

  const isJSON = decoded.includes("{") && decoded.includes("}");
  if (!isJSON) {
    return null;
  }

  try {
    parsed = JSON.parse(decoded);
  } catch (error) {
    console.error(error);
  }

  return parsed;
}

export function decodeMessageV1(encodedObj: string): Message | null {
  const hasObj = !!encodedObj?.trim();
  if (!hasObj) {
    return null;
  }

  const defaultValuesForBackwardsCompatibility = {
    language: LanguageEnum.NorskBokmal,
  };

  const decodedMessage = decodeV1<Message>(encodedObj);

  const decodedMessageIsEmpty =
    JSON.stringify(decodedMessage) === JSON.stringify({});

  if (!decodedMessage || decodedMessageIsEmpty) {
    return null;
  }

  return {
    ...defaultValuesForBackwardsCompatibility,
    ...decodedMessage,
  };
}

const sanitizeString = (str: string): string => {
  return str.replace(/\|/g, "%7C");
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
