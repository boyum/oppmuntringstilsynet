import React, { useEffect, useReducer } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import { languageReducer } from '../reducers/language.reducer';
import LanguageEnum from '../enums/Language';

export default function LanguageStore({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element {
  const localStorageKey = 'language';

  const defaultLanguage = LanguageEnum.NorskBokmal;
  let cachedLanguage: LanguageEnum;

  const isBrowser = process.browser;
  if (isBrowser) {
    cachedLanguage = LanguageEnum[localStorage.getItem(localStorageKey)];

    useEffect(() => localStorage.setItem(localStorageKey, language));
  }

  const [language, dispatch] = useReducer(languageReducer, cachedLanguage ?? defaultLanguage);

  return (
    <LanguageContext.Provider value={[language, dispatch]}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageStore;
