import React from 'react';
import LanguageStore from '../stores/LanguageStore';
import MessageStore from '../stores/MessageStore';
import '../styles/globals.css';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Oppmuntringstilsynet({ Component, pageProps }): JSX.Element {
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
