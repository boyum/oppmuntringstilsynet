import {MouseEventHandler, useContext} from "react";
import {default as LanguageContext} from "../contexts/LanguageContext";
import {default as styles} from "../styles/Buttons.module.css";
import {getTranslations} from "../pages/api/translations";

type Props = {
	handleReset: MouseEventHandler<HTMLButtonElement>;
	handleCopy: MouseEventHandler<HTMLButtonElement>;
};

export default function Buttons(props: Props): JSX.Element {
	const [language] = useContext(LanguageContext);
	const translations = getTranslations(language);

	// rome-ignore lint/jsx-a11y/useKeyWithClickEvents
	return <div className={styles.buttons}>
		<button onClick={props.handleCopy}
		type="button"
		className={styles.copyLink}>
			{translations.copyButtonText}
		</button>
		<button onClick={props.handleReset} type="button" className={styles.reset}>
			{translations.resetButtonText}
		</button>
	</div>;
}
