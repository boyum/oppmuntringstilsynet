import { Locales } from 'locale';
import LanguageEnum from './../enums/Language';
import Language from './../models/Language';
import languages from './../models/languages';
import Translations from './../types/Translations';

export function getLanguage(language: LanguageEnum): Language {
  return languages[language];
}

export function getTranslations(language: LanguageEnum): Translations {
  return getLanguage(language).translations;
}

export function getPreferredSupportedLanguage(preferredLocales: Locales): LanguageEnum {
  const supportedLanguageCodes = Object.values(languages).flatMap(language => language.languageCodes);
  const supportedLocales = new Locales(supportedLanguageCodes);

  const bestPreferredSupportedLanguageCode = preferredLocales.best(supportedLocales);

  const [langEnum, _] = Object.entries(languages).find(([_, language]) => language.languageCodes.includes(bestPreferredSupportedLanguageCode.code))

  return LanguageEnum[langEnum];
}
