import type { Language } from "../enums/Language";
import { languages } from "../models/languages";
import type { Language } from "../types/Language";
import type { Translations } from "../types/Translations";

export function getLanguage(language: Language): Language {
  return languages[language];
}

export function getTranslations(language: Language): Translations {
  return getLanguage(language).translations;
}
