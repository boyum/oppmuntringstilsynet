import LanguageEnum from "../enums/Language";
import Translations from "../types/Translations";
import TranslationsEn from "../types/Translations.en";
import TranslationsNb from "../types/Translations.nb";
import TranslationsNn from "../types/Translations.nn";

export type LanguageRecord = {
  title: string;
  translations: Translations;
  codes: Array<string>;
};

const translations: { [languageName in LanguageEnum]: LanguageRecord } = {
  [LanguageEnum.NorskBokmal]: {
    title: "Norsk bokmål",
    translations: TranslationsNb,
    codes: ["nb", "no"],
  },
  [LanguageEnum.NorskNynorsk]: {
    title: "Norsk nynorsk",
    translations: TranslationsNn,
    codes: ["nn"],
  },
  [LanguageEnum.English]: {
    title: "English",
    translations: TranslationsEn,
    codes: ["en"],
  },
};

export default translations;
