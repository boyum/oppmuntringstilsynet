import React, { MouseEventHandler, useContext } from "react";
import LanguageContext from "../../contexts/LanguageContext";
import { getTranslations } from "../../pages/api/translations";
import styles from "./Buttons.module.css";

type Props = {
  handleReset: MouseEventHandler<HTMLButtonElement>;
  handleCopy: MouseEventHandler<HTMLButtonElement>;
};

export default function Buttons({
  handleCopy,
  handleReset,
}: Props): JSX.Element {
  const [language] = useContext(LanguageContext);
  const translations = getTranslations(language);

  return (
    <div className={styles.buttons}>
      <button type="button" className={styles.copyLink} onClick={handleCopy}>
        {translations.copyButtonText}
      </button>
      <button type="button" className={styles.reset} onClick={handleReset}>
        {translations.resetButtonText}
      </button>
    </div>
  );
}
