import parser from "accept-language-parser";
import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import type { Theme } from "../types/Theme";
import type { ThemeName } from "../types/ThemeName";
import { getFirstAcceptedLanguage, isLanguage } from "./language-utils";
import { getFallbackTheme, getTheme } from "./theme-utils";
import { getEncodedAndDecodedMessage } from "./url-utils";

export type HomeServerProps = {
  encodedMessage: string | null;
  initialMessage: Message | null;
  resolvedUrl: string;
  deployUrl: string;
  preferredLanguage: Language;
  preferredTheme: Theme;
  isIosOrAndroid: boolean;
};

type HomeServerData = {
  searchParams: URLSearchParams;
  resolvedUrl: string;
  host: string | null;
  proto?: string | null;
  acceptLanguage: string;
  userAgent: string | null;
  languageCookie: string | undefined;
  themeCookie: string | undefined;
};

const localUrl = "http://localhost:3000";
const deployUrl = process.env["DEPLOY_URL"] ?? localUrl;

export function toURLSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach(entry => urlSearchParams.append(key, entry));
    } else if (value !== undefined) {
      urlSearchParams.set(key, value);
    }
  }

  return urlSearchParams;
}

export function getAcceptedLanguages(acceptLanguage: string): string[] {
  return parser.parse(acceptLanguage).map(language => language.code);
}

export function getHomeServerProps(data: HomeServerData): HomeServerProps {
  const [encodedMessage, decodedMessage] = getEncodedAndDecodedMessage(
    data.searchParams,
  );

  const preferredLanguage = isLanguage(data.languageCookie)
    ? data.languageCookie
    : getFirstAcceptedLanguage(getAcceptedLanguages(data.acceptLanguage));

  const preferredTheme = data.themeCookie
    ? getTheme(data.themeCookie as ThemeName)
    : getFallbackTheme();

  const isIosOrAndroid = !!data.userAgent?.match(/(iPhone|iPad|Android)/i);

  return {
    encodedMessage,
    initialMessage: decodedMessage,
    resolvedUrl: data.resolvedUrl,
    deployUrl: data.host ? `${data.proto ?? "http"}://${data.host}` : deployUrl,
    preferredLanguage,
    preferredTheme,
    isIosOrAndroid,
  };
}
