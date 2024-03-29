import LZString from "lz-string";
import { LanguageEnum } from "../enums/Language";
import type { Message } from "../types/Message";

export function encode(obj: unknown): string {
  const json = JSON.stringify(obj);

  return LZString.compressToEncodedURIComponent(json);
}

export function decode<Type>(encodedObj: string): Type | null {
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

export function decodeMessage(encodedObj: string): Message | null {
  const hasObj = !!encodedObj;

  if (!hasObj) {
    return null;
  }

  const defaultValuesForBackwardsCompatibility = {
    language: LanguageEnum.NorskBokmal,
  };

  const decodedMessage = decode<Message>(encodedObj);

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
