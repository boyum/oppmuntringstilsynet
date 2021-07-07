import LanguageEnum from "../enums/Language";
import { getLanguage, getPreferredLanguage } from "./language-utils";

describe(getLanguage.name, () => {
  it("should return the language that fits the locale code if it has a country code", () => {
    const localeCode = "nb-NO";

    const expectedLanguage = LanguageEnum.NorskBokmal;
    const actualLanguage = getLanguage(localeCode);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return the language that fits the locale code if it has no country code", () => {
    const localeCode = "nb";

    const expectedLanguage = LanguageEnum.NorskBokmal;
    const actualLanguage = getLanguage(localeCode);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return null if the locale code is not supported", () => {
    const localeCode = "unsupported language";

    const expectedLanguage: LanguageEnum | null = null;
    const actualLanguage = getLanguage(localeCode);

    expect(actualLanguage).toEqual(expectedLanguage);
  });
});

describe(getPreferredLanguage.name, () => {
  it("should get the first language that fits the available languages", () => {
    const preferredLanguages = ["nb-NO", "en-US", "no", "es", "de"];

    const expectedLanguage = LanguageEnum.NorskBokmal;
    const actualLanguage = getPreferredLanguage(preferredLanguages);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return the default language if no preferred language fits", () => {
    const preferredLanguages = ["invalid", "languages"];

    const expectedLanguage = LanguageEnum.English;
    const actualLanguage = getPreferredLanguage(preferredLanguages);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return the default language if there are no preferred languages", () => {
    const preferredLanguages: Array<string> = [];

    const expectedLanguage = LanguageEnum.English;
    const actualLanguage = getPreferredLanguage(preferredLanguages);

    expect(actualLanguage).toEqual(expectedLanguage);
  });
});
