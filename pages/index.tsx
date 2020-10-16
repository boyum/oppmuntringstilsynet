import Head from 'next/head';
import React, { useContext, useRef, useState } from 'react';
import Form from '../components/Form';
import LanguageContext from '../contexts/LanguageContext';
import styles from '../styles/Home.module.css';
import Message from '../types/Message';
import Translations from '../types/Translations';
import { decode, encode } from './api/url';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const messageFromUrl = decode<Message>(router.query.m as string);
  const translations = useContext<Translations>(LanguageContext);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(messageFromUrl);
  const tempInput = useRef<HTMLInputElement>(null);

  console.log('message', message, messageFromUrl);

  function handleCopy() {
    const encodedMessage = encode(message);
    const url = new URL(window.location.href)
    url.searchParams.set('m', encodedMessage);

    setUrl(url.href);

    requestAnimationFrame(() => {
      tempInput.current.select();
      tempInput.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
    });
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

        <Form message={message} setMessage={setMessage} handleCopy={handleCopy}></Form>

        <input ref={tempInput} type="text" className={styles.hidden} value={url} readOnly />
      </div>
    </>
  );
}

