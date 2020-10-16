import SupportedLanguage from '../../enums/SupportedLanguage';
import TranslationsEn from '../../types/Translations.en';
import TranslationsNb from '../../types/Translations.nb';

export function getTranslation(language: SupportedLanguage, key: string): string {
  switch (language) {
    case SupportedLanguage.NorwegianBokmal: return TranslationsNb[key];
    case SupportedLanguage.English: return TranslationsEn[key];
  }
}