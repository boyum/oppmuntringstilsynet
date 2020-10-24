import {ChangeEventHandler, useContext} from "react";
import {default as LanguageContext} from "../contexts/LanguageContext";
import {default as LanguageEnum} from "../enums/Language";
import {default as Language} from "../models/Language";
import {default as languages} from "../models/languages";
import {getTranslations} from "../pages/api/translations";
import {default as styles} from "../styles/LanguagePicker.module.css";

export default function LanguagePicker(
	{handleChange}: {
		handleChange: (newLanguage: LanguageEnum) => void;
	},
) {
	const [language, setLanguage] = useContext(LanguageContext);
	const languageArr = Object.entries(languages).map((
		[languageName, language]: [string, Language],
	) => [languageName, language.title]);

	const translations = getTranslations(language);

	const handleOnChange: ChangeEventHandler<HTMLSelectElement> = (
		{currentTarget},
	) => {
		const newLanguage = LanguageEnum[currentTarget.value];
		handleChange(newLanguage);

		setLanguage({
			type: "setLanguage",
			payload: newLanguage,
		});
	};

	return <label>
		<span className="hidden">
			{translations.setLanguage}
		</span>
		<select className={styles.select}
		onSelect={handleOnChange}
		value={language}>
			{languageArr.map(([languageName, languageTitle]) =>
				<option key={languageName}
				className={styles.option}
				value={languageName}>
					{languageTitle}
				</option>
			)}
		</select>
	</label>;
}
