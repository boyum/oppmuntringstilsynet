import { LanguageEnum } from "../enums/Language";
import { TranslationsEn } from "../types/Translations.en";
import { TranslationsNb } from "../types/Translations.nb";
import { TranslationsNn } from "../types/Translations.nn";

export const languages = {
  [LanguageEnum.NorskBokmal]: {
    title: "Norsk bokmål",
    translations: TranslationsNb,
    codes: ["nb", "no"] as const,
  },
  [LanguageEnum.NorskNynorsk]: {
    title: "Norsk nynorsk",
    translations: TranslationsNn,
    codes: ["nn"] as const,
  },
  [LanguageEnum.English]: {
    title: "English",
    translations: TranslationsEn,
    codes: ["en"] as const,
  },
};
