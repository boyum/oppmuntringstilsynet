import { ChangeEventHandler, useContext } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import LanguageEnum from '../../enums/Language';
import Language from '../../models/Language';
import languages from '../../models/languages';
import { getTranslations } from '../../pages/api/translations';
import styles from './LanguagePicker.module.css';

export default function LanguagePicker({ handleChange }: { handleChange: (newLanguage: LanguageEnum) => void }) {
  const [language, setLanguage] = useContext(LanguageContext);
  const languageArr = Object.entries(languages)
    .map(([languageName, language]: [string, Language]) => [languageName, language.title]);

  const translations = getTranslations(language);

  const handleOnChange: ChangeEventHandler<HTMLSelectElement> = ({ currentTarget }) => {
    const newLanguage = LanguageEnum[currentTarget.value as LanguageEnum];
    handleChange(newLanguage);

    setLanguage({
      type: 'setLanguage',
      payload: newLanguage,
    });
  };

  return (
    <label>
      <span className="hidden">{translations.setLanguage}</span>
      <select className={styles.select} onChange={handleOnChange} value={language}>
        {languageArr.map(([languageName, languageTitle]) => (
          <option key={languageName} className={styles.option} value={languageName}>{languageTitle}</option>
        ))}
      </select>
    </label>
  );
}
