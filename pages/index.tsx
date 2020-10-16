import Head from 'next/head';
import React, { useContext } from 'react';
import Form from '../components/Form';
import LanguageContext from '../contexts/LanguageContext';
import styles from '../styles/Home.module.css';
import Message from '../types/Message';
import Translations from '../types/Translations';

export default function Home() {
  const translations = useContext<Translations>(LanguageContext);
  let message: Message;
  let url: string;

  function handleCopy() {
    
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

        <Form message={message} handleCopy={handleCopy}></Form>

        <input type="text" className="hidden" value={url} />
      </div>
    </>
  );
}

