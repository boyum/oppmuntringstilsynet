import LanguageEnum from "../enums/Language";
import translations from "../models/languages";

export function getLanguage(localeCode: string): LanguageEnum | null {
  const languageCode = localeCode.slice(0, 2);

  const [language] =
    Object.entries(translations).find(([, languageRecord]) =>
      languageRecord.codes.includes(languageCode),
    ) ?? [];

  return <LanguageEnum>language ?? null;
}

export function getPreferredLanguage(
  preferredLanguages: Array<string>,
): LanguageEnum {
  const defaultLanguage = LanguageEnum.English;

  // eslint-disable-next-line no-restricted-syntax
  for (const localeCode of preferredLanguages) {
    const language = getLanguage(localeCode);

    if (language) {
      return language;
    }
  }

  return defaultLanguage;
}
