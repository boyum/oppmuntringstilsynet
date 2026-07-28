import parser from "accept-language-parser";
import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import type { Theme } from "../types/Theme";
import type { ThemeName } from "../types/ThemeName";
import { getEncodedAndDecodedMessage } from "./url-utils";
import { getFirstAcceptedLanguage, isLanguage } from "./language-utils";
import { getFallbackTheme, getTheme } from "./theme-utils";

const localUrl = "http://localhost:3000";
const defaultDeployUrl = process.env["DEPLOY_URL"] ?? localUrl;

export type HomeResolvedProps = {
  encodedMessage: string | null;
  initialMessage: Message | null;
  resolvedUrl: string;
  deployUrl: string;
  preferredLanguage: Language;
  preferredTheme: Theme;
  isIosOrAndroid: boolean;
};

type HomePagePropsInput = {
  resolvedUrl: string | undefined;
  host?: string | undefined;
  acceptLanguage?: string | undefined;
  userAgent?: string | undefined;
  languageCookie?: string | undefined;
  themeCookie?: ThemeName | undefined;
};

export function getQueryParams(resolvedUrl: string): URLSearchParams {
  const [, ...queryParams] = resolvedUrl.split("?");

  return new URLSearchParams(queryParams.join());
}

export function getAcceptedLanguages(acceptLanguage: string): string[] {
  return parser.parse(acceptLanguage).map(language => language.code);
}

export function getResolvedUrl(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        query.append(key, entry);
      }
      continue;
    }

    if (typeof value === "string") {
      query.append(key, value);
    }
  }

  const renderedQuery = query.toString();
  return renderedQuery ? `/?${renderedQuery}` : "/";
}

export function getHomePageProps(
  input: HomePagePropsInput,
): HomeResolvedProps {
  const {
    resolvedUrl,
    host,
    acceptLanguage,
    userAgent,
    languageCookie,
    themeCookie,
  } = input;

  if (!resolvedUrl) {
    console.error("Request URL is undefined");
    return {
      encodedMessage: null,
      initialMessage: null,
      resolvedUrl: "",
      deployUrl: defaultDeployUrl,
      preferredLanguage: Language.NorskBokmal,
      preferredTheme: getFallbackTheme(),
      isIosOrAndroid: false,
    };
  }

  const queryParams = getQueryParams(resolvedUrl);
  const [encodedMessage, decodedMessage] = getEncodedAndDecodedMessage(queryParams);

  const acceptedLanguages = getAcceptedLanguages(acceptLanguage ?? "");
  const preferredLanguage = isLanguage(languageCookie)
    ? languageCookie
    : getFirstAcceptedLanguage(acceptedLanguages);

  const preferredTheme = themeCookie
    ? getTheme(themeCookie)
    : getFallbackTheme();

  const isIosOrAndroid = !!userAgent?.match(/(iPhone|iPad|Android)/i);

  return {
    encodedMessage,
    initialMessage: decodedMessage,
    resolvedUrl,
    deployUrl: host ? `//${host}` : defaultDeployUrl,
    preferredLanguage,
    preferredTheme,
    isIosOrAndroid,
  };
}