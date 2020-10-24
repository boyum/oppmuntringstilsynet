import React from 'react'
import LanguageStore from '../stores/LanguageStore'
import MessageStore from '../stores/MessageStore'
import '../styles/globals.css'
import Home from '.';

function Oppmuntringstilsynet({ Component, pageProps }: { Component: typeof Home, pageProps: any }) {
  return (
    <MessageStore>
      <LanguageStore>
        <Component {...pageProps} />
      </LanguageStore>
    </MessageStore>
  )
}

export default Oppmuntringstilsynet
