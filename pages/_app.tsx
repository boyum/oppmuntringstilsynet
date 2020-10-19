import React from 'react'
import LanguageStore from '../stores/LanguageStore'
import MessageStore from '../stores/MessageStore'
import '../styles/globals.css'

function Oppmuntringstilsynet({ Component, pageProps }) {
  return (
    <MessageStore>
      <LanguageStore>
        <Component {...pageProps} />
      </LanguageStore>
    </MessageStore>
  )
}

export default Oppmuntringstilsynet
