import { useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import { getTranslations } from '../utils/language-utils';
import styles from '../styles/Footer.module.css';

export default function Footer(): JSX.Element {
  const [language, setLanguage] = useContext(LanguageContext);
  const translations = getTranslations(language);

  return (
    <footer className={styles.footer} dangerouslySetInnerHTML={{ __html: translations.footerHtml }}></footer>
  );
}
