import Cookies from "js-cookie";
import { LanguageEnum } from "../enums/Language";
import { languages } from "../models/languages";
import type { LocaleCode } from "../types/LocaleCode";

export const defaultLanguage = LanguageEnum.NorskBokmal;

export const isLanguage = (
  value: string | undefined,
): value is LanguageEnum => {
  if (!value) {
    return false;
  }

  return Object.values(LanguageEnum).includes(value as LanguageEnum);
};

export function getLanguage(localeCode: string): LanguageEnum | null {
  const languageCode = localeCode.slice(0, 2) as LocaleCode;

  const [language] =
    Object.entries(languages).find(([, languageRecord]) =>
      (languageRecord.codes as ReadonlyArray<LocaleCode>).includes(
        languageCode,
      ),
    ) ?? [];

  return (language as LanguageEnum | undefined) ?? null;
}

export function getFirstAcceptedLanguage(
  preferredLanguages: Array<string>,
): LanguageEnum {
  const defaultLanguage = LanguageEnum.English;

  for (const localeCode of preferredLanguages) {
    const language = getLanguage(localeCode);

    if (language) {
      return language;
    }
  }

  return defaultLanguage;
}

export function storeLanguageInCookie(language: LanguageEnum): void {
  Cookies.set("language", language);
}
