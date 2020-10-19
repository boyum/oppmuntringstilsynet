import LanguageEnum from '../../enums/Language';
import Language from '../../models/Language';
import languages from '../../models/languages';
import Translations from '../../types/Translations';

export function getLanguage(language: LanguageEnum): Language {
  return languages[language];
}

export function getTranslations(language: LanguageEnum): Translations {
  return getLanguage(language).translations;
}
