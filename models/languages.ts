import LanguageEnum from '../enums/Language';
import TranslationsEn from '../types/Translations.en';
import TranslationsNb from '../types/Translations.nb';
import TranslationsNn from '../types/Translations.nn';

export default {
  [LanguageEnum.NorskBokmal]: {
    title: 'Norsk bokmål',
    translations: TranslationsNb,
    languageCodes: ['nb', 'no'],
  },
  [LanguageEnum.NorskNynorsk]: {
    title: 'Norsk nynorsk',
    translations: TranslationsNn,
    languageCodes: ['nn'],
  },
  [LanguageEnum.English]: {
    title: 'English',
    translations: TranslationsEn,
    languageCodes: ['en'],
  },
};
