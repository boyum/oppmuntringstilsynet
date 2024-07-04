import type { Translations } from "../types/Translations";
import { getTranslations } from "../utils/translations-utils";
import { useLanguage } from "./useLanguage";

export const useTranslations = (): Translations => {
  const [language] = useLanguage();
  const translations = getTranslations(language);

  return translations;
};
