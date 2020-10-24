import {default as LanguageEnum} from "../enums/Language";
import {default as TranslationsEn} from "../types/Translations.en";
import {default as TranslationsNb} from "../types/Translations.nb";
import {default as TranslationsNn} from "../types/Translations.nn";

export default {
	[LanguageEnum.NorskBokmal]: {
		title: "Norsk bokm\xe5l",
		translations: TranslationsNb,
	},
	[LanguageEnum.NorskNynorsk]: {
		title: "Norsk nynorsk",
		translations: TranslationsNn,
	},
	[LanguageEnum.English]: {
		title: "English",
		translations: TranslationsEn,
	},
};
