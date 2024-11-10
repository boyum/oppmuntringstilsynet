import type { Language } from "../enums/Language";
import { languages } from "../models/languages";

export function getLanguage(language: Language) {
  return languages[language];
}

export function getTranslations(language: Language) {
  return getLanguage(language).translations;
}
