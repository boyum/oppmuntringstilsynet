import React, { useEffect } from 'react';
import LanguageStore from '../stores/LanguageStore';
import MessageStore from '../stores/MessageStore';
import '../styles/globals.css';
import '../styles/themes.css';
import { themes } from '../types/Themes';
import { getActiveTheme, setPageTheme } from './api/theme';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Oppmuntringstilsynet({ Component, pageProps }): JSX.Element {
  useEffect(() => {
    const activeTheme = getActiveTheme(themes);
    setPageTheme(activeTheme.name);
  }, []);

  return (
    <MessageStore>
      <LanguageStore>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </LanguageStore>
    </MessageStore>
  );
}

export default Oppmuntringstilsynet;
