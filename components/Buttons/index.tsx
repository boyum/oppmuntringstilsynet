import React, { MouseEventHandler, useContext } from "react";
import LanguageContext from "../../contexts/LanguageContext";
import { getTranslations } from "../../pages/api/translations";
import styles from "./Buttons.module.scss";

type Props = {
  handleReset: MouseEventHandler<HTMLButtonElement>;
  handleCopyLink: MouseEventHandler<HTMLButtonElement>;
  handleDownloadImage: MouseEventHandler<HTMLButtonElement>;
};

export default function Buttons({
  handleCopyLink,
  handleReset,
  handleDownloadImage,
}: Props): JSX.Element {
  const [language] = useContext(LanguageContext);
  const translations = getTranslations(language);

  return (
    <div className={styles.buttons}>
      <button
        type="button"
        className={styles.copyLink}
        onClick={handleCopyLink}
      >
        <div className={styles.buttonInner}>
          {translations.copyLinkButtonText}
        </div>
      </button>
      <button type="button" className={styles.reset} onClick={handleReset}>
        <div className={styles.buttonInner}>{translations.resetButtonText}</div>
      </button>
      <button
        type="button"
        className={styles.downloadImage}
        onClick={handleDownloadImage}
      >
        <div className={styles.buttonInner}>
          {translations.downloadImageButtonText}
        </div>
      </button>
    </div>
  );
}
