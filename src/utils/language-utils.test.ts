import * as fc from "fast-check";
import { Language } from "../enums/Language";
import { languages } from "../models/languages";
import type { LocaleCode } from "../types/LocaleCode";
import {
  getFirstAcceptedLanguage,
  getLanguage,
  isLanguage,
} from "./language-utils";

describe(getLanguage, () => {
  it("should return the language that fits the locale code if it has a country code", () => {
    const localeCode = "nb-NO";

    const expectedLanguage = Language.NorskBokmal;
    const actualLanguage = getLanguage(localeCode);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return the language that fits the locale code if it has no country code", () => {
    const localeCode = "nb";

    const expectedLanguage = Language.NorskBokmal;
    const actualLanguage = getLanguage(localeCode);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return null if the locale code is not supported", () => {
    const consoleError = console.error;
    console.error = () => undefined;

    const testResult = fc.assert(
      fc.property(fc.string(), localeCode => {
        const expectedLanguage: Language | null = null;
        const actualLanguage = getLanguage(localeCode);

        const isSupportedCode = Object.values(languages)
          .flatMap(language => language.codes)
          .includes(localeCode.trim() as LocaleCode);

        if (isSupportedCode) {
          return true;
        }

        return actualLanguage === expectedLanguage;
      }),
    );

    console.error = consoleError;

    return testResult;
  });
});

describe(getFirstAcceptedLanguage, () => {
  it("should get the first language that fits the available languages", () => {
    const preferredLanguages = ["nb-NO", "en-US", "no", "es", "de"];

    const expectedLanguage = Language.NorskBokmal;
    const actualLanguage = getFirstAcceptedLanguage(preferredLanguages);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return the default language if no preferred language fits", () => {
    const preferredLanguages = ["invalid", "languages"];

    const expectedLanguage = Language.English;
    const actualLanguage = getFirstAcceptedLanguage(preferredLanguages);

    expect(actualLanguage).toEqual(expectedLanguage);
  });

  it("should return the default language if there are no preferred languages", () => {
    const preferredLanguages: Array<string> = [];

    const expectedLanguage = Language.English;
    const actualLanguage = getFirstAcceptedLanguage(preferredLanguages);

    expect(actualLanguage).toEqual(expectedLanguage);
  });
});

describe(isLanguage, () => {
  it("should handle undefined values", () => {
    const value = undefined;

    const actualResult = isLanguage(value);

    expect(actualResult).toBe(false);
  });
});
