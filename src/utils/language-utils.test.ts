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

  it("should only return a language if the locale code starts with a supported code", () => {
    const testResult = fc.assert(
      fc.property(fc.string(), localeCode => {
        const languagePrefix = localeCode.slice(0, 2);

        const expectedLanguage = (Object.entries(languages).find(
          ([, language]) =>
            (language.codes as ReadonlyArray<LocaleCode>).includes(
              languagePrefix as LocaleCode,
            ),
        )?.[0] ?? null) as Language | null;

        const actualLanguage = getLanguage(localeCode);

        return actualLanguage === expectedLanguage;
      }),
    );

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
