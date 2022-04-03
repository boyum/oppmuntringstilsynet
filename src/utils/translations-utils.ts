import type { LanguageEnum } from "../enums/Language";
import type { Language } from "../types/Language";
import { languages } from "../models/languages";
import type { Translations } from "../types/Translations";

export function getLanguage(language: LanguageEnum): Language {
  return languages[language];
}

export function getTranslations(language: LanguageEnum): Translations {
  return getLanguage(language).translations;
}
