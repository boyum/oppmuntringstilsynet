import { render } from "@testing-library/react";
import { Language } from "../enums/Language";
import { languages } from "../models/languages";
import { TranslationsNb } from "../types/Translations.nb";
import { getDefaultHtmlHeadData, HtmlHead } from "./html-head-utils";

describe(getDefaultHtmlHeadData.name, () => {
  it("should return html head data corresponding to the current language", () => {
    const language = Language.NorskBokmal;

    const expectedData = {
      title: TranslationsNb.pageTitle,
      ogTitle: TranslationsNb.pageOgTitle,
      description: TranslationsNb.pageDescription,
      ogDescription: TranslationsNb.pageDescription,
    };

    const actualData = getDefaultHtmlHeadData(language);

    expect(actualData).toEqual(expectedData);
  });
});

describe(HtmlHead, () => {
  it("should render meta tags", () => {
    const language = Language.NorskBokmal;
    const ogUrl = "url";
    const deployUrl = "deployUrl";
    const encodedMessage = "encodedMessage";

    const title = languages[language].translations.pageTitle;
    const ogTitle = languages[language].translations.pageOgTitle;
    const description = languages[language].translations.pageDescription;
    const ogDescription = languages[language].translations.pageDescription;

    render(
      <HtmlHead
        language={language}
        ogUrl={ogUrl}
        encodedMessage={encodedMessage}
        deployUrl={deployUrl}
      />,
    );

    const titleElement = document.head.querySelector("title");
    const metaDescriptionElement = document.head.querySelector(
      "meta[name=description]",
    );
    const metaOgTitleElement = document.head.querySelector(
      `meta[property="og:title"]`,
    );
    const metaOgDescriptionElement = document.head.querySelector(
      `meta[property="og:description"]`,
    );
    const metaOgUrlElement = document.head.querySelector(
      `meta[property="og:url"]`,
    );

    expect(titleElement?.innerHTML).toBe(title);
    expect(metaDescriptionElement?.getAttribute("content")).toBe(description);
    expect(metaOgTitleElement?.getAttribute("content")).toBe(ogTitle);
    expect(metaOgDescriptionElement?.getAttribute("content")).toBe(
      ogDescription,
    );
    expect(metaOgUrlElement?.getAttribute("content")).toBe(ogUrl);
  });
});
