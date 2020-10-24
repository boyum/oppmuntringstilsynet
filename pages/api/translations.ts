import {default as LanguageEnum} from "../../enums/Language";
import {default as Language} from "../../models/Language";
import {default as languages} from "../../models/languages";
import {default as Translations} from "../../types/Translations";

export function getLanguage(language: LanguageEnum): Language {
	return languages[language];
}

export function getTranslations(language: LanguageEnum): Translations {
	return getLanguage(language).translations;
}
