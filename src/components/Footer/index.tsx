import { useContext } from "react";
import LanguageContext from "../../contexts/LanguageContext";
import { getTranslations } from "../../utils/translations-utils";
import styles from "./Footer.module.css";

export default function Footer(): JSX.Element {
  const [language] = useContext(LanguageContext);
  const translations = getTranslations(language);

  return (
    <footer
      className={styles.footer}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: translations.footerHtml }}
    />
  );
}
