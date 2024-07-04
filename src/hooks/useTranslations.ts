import { getTranslations } from "../utils/translations-utils";
import type { Translations } from "../types/Translations";
import { useLanguage } from "./useLanguage";

export const useTranslations = (): Translations => {
  const [language] = useLanguage();
  const translations = getTranslations(language);

  return translations;
};
