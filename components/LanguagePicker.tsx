import { ChangeEventHandler, useContext } from 'react';
import languages from '../models/languages';
import LanguageContext from '../contexts/LanguageContext';
import Language from '../models/Language';
import LanguageEnum from '../enums/Language';
import styles from '../styles/LanguagePicker.module.css';

export default function LanguagePicker({ handleChange }: { handleChange: (newLanguage: LanguageEnum) => void }) {
  const [language, setLanguage] = useContext(LanguageContext);
  const languageArr =
    Object.entries(languages)
      .map(([languageName, language]: [string, Language]) => [languageName, language.title]);

  const handleOnChange: ChangeEventHandler<HTMLSelectElement> = ({ currentTarget }) => {
    const newLanguage = LanguageEnum[currentTarget.value];
    handleChange(newLanguage);

    setLanguage({
      type: 'setLanguage',
      payload: newLanguage,
    });
  };

  return (
    <select className={styles.select} onChange={handleOnChange} value={language}>
      {languageArr.map(([languageName, languageTitle]) => (
        <option key={languageName} value={languageName}>{languageTitle}</option>
      ))}
    </select>
  );
}