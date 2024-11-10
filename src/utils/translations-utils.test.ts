import { Language } from "../enums/Language";
import { languages } from "../models/languages";
import { getLanguage, getTranslations } from "./translations-utils";

describe(getLanguage.name, () => {
  it("should return the language that corresponds to the provided language name", () => {
    const languageName = Language.English;

    const expectedLanguage = languages.English;
    const actualLanguage = getLanguage(languageName);

    expect(actualLanguage).toEqual(expectedLanguage);
  });
});

describe(getTranslations.name, () => {
  it("should return translations of the language that corresponds to the provided language name", () => {
    const languageName = Language.English;

    const expectedTranslations = languages.English.translations;
    const actualTranslations = getTranslations(languageName);

    expect(actualTranslations).toEqual(expectedTranslations);
  });
});
