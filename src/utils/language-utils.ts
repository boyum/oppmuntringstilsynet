import Cookies from "js-cookie";
import { Language } from "../enums/Language";
import { languages } from "../models/languages";
import type { LocaleCode } from "../types/LocaleCode";

export const defaultLanguage = Language.NorskBokmal;

export const isLanguage = (value: string | undefined): value is Language => {
  if (!value) {
    return false;
  }

  return Object.values(Language).includes(value as Language);
};

export function getLanguage(localeCode: string): Language | null {
  const languageCode = localeCode.slice(0, 2) as LocaleCode;

  const [language] =
    Object.entries(languages).find(([, languageRecord]) =>
      (languageRecord.codes as ReadonlyArray<LocaleCode>).includes(
        languageCode,
      ),
    ) ?? [];

  return (language as Language | undefined) ?? null;
}

export function getFirstAcceptedLanguage(
  preferredLanguages: Array<string>,
): Language {
  const defaultLanguage = Language.English;

  for (const localeCode of preferredLanguages) {
    const language = getLanguage(localeCode);

    if (language) {
      return language;
    }
  }

  return defaultLanguage;
}

export function storeLanguageInCookie(language: Language): void {
  Cookies.set("language", language);
}
