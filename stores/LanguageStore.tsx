import {useReducer} from "react";
import {default as LanguageContext} from "../contexts/LanguageContext";
import {languageReducer} from "../reducers/language.reducer";
import {default as LanguageEnum} from "../enums/Language";

export default function LanguageStore(
	{children}: {
		children: JSX.Element | Array<JSX.Element>;
	},
): JSX.Element {
	const [language, dispatch] = useReducer(
		languageReducer,
		LanguageEnum.NorskBokmal,
	);

	return <LanguageContext.Provider value={[language, dispatch]}>
		{children}
	</LanguageContext.Provider>;
}
