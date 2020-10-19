import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Buttons from '../components/Buttons';
import Form from '../components/Form';
import LanguagePicker from '../components/LanguagePicker';
import LanguageContext from '../contexts/LanguageContext';
import MessageContext from '../contexts/MessageContext';
import LanguageEnum from '../enums/Language';
import styles from '../styles/Home.module.css';
import { isEmpty } from '../utils/message-utils';
import { getTranslations } from './api/translations';
import { decodeMessage, encode } from './api/url';

export default function Home({ encodedMessage }: { encodedMessage: string }) {
  const [language, dispatchLanguageAction] = useContext(LanguageContext);
  const [message, dispatchMessageAction] = useContext(MessageContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();
  const tempInput = useRef<HTMLInputElement>(null);

  const messageFromUrl = decodeMessage(encodedMessage);
  const translations = getTranslations(language);

  useEffect(() => {
    const hasMessage = !!messageFromUrl;
    const messageIsEmpty = isEmpty(message);

    if (hasMessage && messageIsEmpty && !isResetting) {
      dispatchMessageAction({ type: 'setValue', payload: messageFromUrl });
      dispatchLanguageAction({ type: 'setLanguage', payload: messageFromUrl.language });
      setIsDisabled(true);
    }
  });

  const tagManagerHtml = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MPPJRMK');</script>`;

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
    dispatchMessageAction({ type: 'reset' });
    setIsResetting(true);
    setIsDisabled(false);
  }

  function handleLanguageChange(newLanguage: LanguageEnum) {
    dispatchMessageAction({
      type: 'setValue',
      payload: {
        language: newLanguage,
      },
    });
  }

  return (
    <>
      <Head>
        <title>{translations.pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap" rel="stylesheet" />
        <div dangerouslySetInnerHTML={{ __html: tagManagerHtml }}></div>
      </Head>
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPPJRMK" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
      <div className={styles.container}>
        <div className={styles.containerHeader}>
          <h1 className={styles.heading}>{translations.formHeading}</h1>
          <div className={styles.languagePickerContainer}>
            <LanguagePicker handleChange={handleLanguageChange} />
          </div>
        </div>

        <Form isDisabled={isDisabled} />
        <Buttons handleReset={handleReset} handleCopy={handleCopy} />
        <label className="hidden">Hidden label used for copying<input ref={tempInput} type="text" readOnly tabIndex={-1} /></label>
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