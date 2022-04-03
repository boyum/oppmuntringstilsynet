import { LanguageEnum } from "../enums/Language";
import { languages } from "../models/languages";
import type { Translations } from "../types/Translations";
import { getLanguage } from "./translations-utils";

export function getTranslations(language: LanguageEnum): Translations {
  return getLanguage(language).translations;
}

describe(getLanguage.name, () => {
  it("should return the language that corresponds to the provided language name", () => {
    const languageName = LanguageEnum.English;

    const expectedLanguage = languages.English;
    const actualLanguage = getLanguage(languageName);

    expect(actualLanguage).toEqual(expectedLanguage);
  });
});

describe(getTranslations.name, () => {
  it("should return translations of the language that corresponds to the provided language name", () => {
    const languageName = LanguageEnum.English;

    const expectedTranslations = languages.English.translations;
    const actualTranslations = getTranslations(languageName);

    expect(actualTranslations).toEqual(expectedTranslations);
  });
});
