import SupportedLanguage from '../../enums/SupportedLanguage';

export function getLanguage(): SupportedLanguage {
  let language = getLanguageCache();

  const noStoredLanguage = !!language;
  if (noStoredLanguage) {
    language = SupportedLanguage.NorwegianBokmal;
    setLanguageCache(SupportedLanguage[language]);
  }

  return language;
}

export function setLanguage(language: SupportedLanguage) {
  setLanguageCache(language);
}

function setLanguageCache(language: SupportedLanguage) {
  window.localStorage.setItem('language', language)
}

function getLanguageCache(): SupportedLanguage {
  return SupportedLanguage[window.localStorage.getItem('language')];
}