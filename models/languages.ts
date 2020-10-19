import LanguageEnum from '../enums/Language';
import TranslationsEn from '../types/Translations.en';
import TranslationsNb from '../types/Translations.nb';

export default {
  [LanguageEnum.NorskBokmal]: {
    title: 'Norsk bokmål',
    translations: TranslationsNb
  },
  [LanguageEnum.English]: {
    title: 'English',
    translations: TranslationsEn
  },
};