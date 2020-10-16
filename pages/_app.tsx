import React from 'react'
import LanguageContext from '../contexts/LanguageContext'
import languages from '../models/languages'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <LanguageContext.Provider value={languages.NorskBokmal}>
      <Component {...pageProps} />
    </LanguageContext.Provider>
  )
}

export default MyApp
