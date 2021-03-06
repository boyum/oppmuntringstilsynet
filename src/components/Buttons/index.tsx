import { MouseEventHandler, useContext } from "react";
import LanguageContext from "../../contexts/LanguageContext";
import { getTranslations } from "../../utils/translations-utils";
import styles from "./Buttons.module.scss";

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
    <div className={styles.buttons} id="buttons">
      <button
        type="button"
        id="copy-button"
        className={styles.copyLink}
        onClick={handleCopy}
      >
        <div className={styles.buttonInner}>{translations.copyButtonText}</div>
      </button>
      <button
        type="button"
        id="reset-button"
        className={styles.reset}
        onClick={handleReset}
      >
        <div className={styles.buttonInner}>{translations.resetButtonText}</div>
      </button>
    </div>
  );
}
