import { MouseEventHandler, useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import styles from '../styles/Buttons.module.css';
import { getTranslations } from '../pages/api/translations';

type Props = {
  handleReset: MouseEventHandler<HTMLButtonElement>;
  handleCopy: MouseEventHandler<HTMLButtonElement>;
};

export default function Buttons(props: Props): JSX.Element {
  const [language, _] = useContext(LanguageContext);
  const translations = getTranslations(language);

  return (
    <div className={styles.buttons}>
      <button className={styles.copyLink} onClick={props.handleCopy}>{translations.copyButtonText}</button>
      <button className={styles.reset} onClick={props.handleReset}>{translations.resetButtonText}</button>
    </div>
  );
}
