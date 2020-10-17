import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Form from '../components/Form';
import LanguageContext from '../contexts/LanguageContext';
import Message from '../types/Message';
import Translations from '../types/Translations';
import { decode, encode } from './api/url';
import Buttons from '../components/Buttons';
import MessageContext from '../contexts/MessageContext';
import { isEmpty } from '../utils/message-utils';

import styles from '../styles/Home.module.css';

export default function Home({ encodedMessage }: { encodedMessage: string }) {
  const messageFromUrl = decode<Message>(encodedMessage);

  const translations = useContext<Translations>(LanguageContext);
  const tempInput = useRef<HTMLInputElement>(null);
  const [message, dispatch] = useContext(MessageContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const hasMessage = !!messageFromUrl;
    const messageIsEmpty = isEmpty(message);

    if (hasMessage && messageIsEmpty && !isResetting) {
      dispatch({ type: 'setValue', payload: messageFromUrl });
      setIsDisabled(true);
    }
  });

  function handleCopy() {
    const encodedMessage = encode(message);
    const url = new URL(window.location.href)
    url.searchParams.set('m', encodedMessage);

    tempInput.current.value = url.href;
    tempInput.current.select();
    tempInput.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  function handleReset() {
    router.push('/');
    dispatch({ type: 'reset' });
    setIsResetting(true);
    setIsDisabled(false);
  }

  return (
    <>
      <Head>
        <title>{translations.pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap" rel="stylesheet" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.heading}>{translations.formHeading}</h1>

        <Form isDisabled={isDisabled}></Form>
        <Buttons handleReset={handleReset} handleCopy={handleCopy}></Buttons>
        <input ref={tempInput} type="text" className={styles.hidden} readOnly />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      encodedMessage: context.query.m ?? '',
    },
  }
}