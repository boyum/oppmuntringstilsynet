import { MouseEventHandler, useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import Translations from '../types/Translations';
import styles from '../styles/Buttons.module.css';

type Props = {
  handleReset: MouseEventHandler<HTMLButtonElement>;
  handleCopy: MouseEventHandler<HTMLButtonElement>;
};

export default function Buttons(props: Props): JSX.Element {
  const translations = useContext<Translations>(LanguageContext);

  return (
    <div className={styles.buttons}>
      <button className={styles.copyLink} onClick={props.handleCopy}>{translations.copyButtonText}</button>
      <button className={styles.reset} onClick={props.handleReset}>{translations.resetButtonText}</button>
    </div>
  );
}