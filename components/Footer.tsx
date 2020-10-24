import {useContext} from "react";
import {default as LanguageContext} from "../contexts/LanguageContext";
import {getTranslations} from "../pages/api/translations";
import {default as styles} from "../styles/Footer.module.css";

export default function Footer(): JSX.Element {
	const [language] = useContext(LanguageContext);
	const translations = getTranslations(language);

	// rome-ignore lint/react/noDanger
	return <footer className={styles.footer}
	dangerouslySetInnerHTML={{__html: translations.footerHtml}} />;
}
