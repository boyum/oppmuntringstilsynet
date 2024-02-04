import { LanguageEnum } from "../enums/Language";
import { languages } from "../models/languages";
import type { LocaleCode } from "../types/LocaleCode";

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

export function getPreferredLanguage(
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
