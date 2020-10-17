import React from 'react'
import LanguageContext from '../contexts/LanguageContext'
import languages from '../models/languages'
import MessageStore from '../stores/MessageStore'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <MessageStore>
      <LanguageContext.Provider value={languages.NorskBokmal}>
        <Component {...pageProps} />
      </LanguageContext.Provider>
    </MessageStore>
  )
}

export default MyApp
