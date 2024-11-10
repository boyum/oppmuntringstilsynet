import { act } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { Language } from "../enums/Language";
import { languages } from "../models/languages";
import { TranslationsNb } from "../types/Translations.nb";
import { getDefaultHtmlHeadData, renderHtmlHead } from "./html-head-utils";

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

describe(renderHtmlHead.name, () => {
  it("should render meta tags", () => {
    const language = Language.NorskBokmal;
    const ogUrl = "url";
    const deployUrl = "deployUrl";
    const encodedMessage = "encodedMessage";

    const title = languages[language].translations.pageTitle;
    const ogTitle = languages[language].translations.pageOgTitle;
    const description = languages[language].translations.pageDescription;
    const ogDescription = languages[language].translations.pageDescription;

    const container = document.createElement("div");

    act(() => {
      createRoot(container).render(
        renderHtmlHead(language, ogUrl, encodedMessage, deployUrl),
      );
    });

    const titleElement = container.querySelector("title");
    const metaDescriptionElement = container.querySelector(
      "meta[name=description]",
    );
    const metaOgTitleElement = container.querySelector(
      `meta[property="og:title"]`,
    );
    const metaOgDescriptionElement = container.querySelector(
      `meta[property="og:description"]`,
    );
    const metaOgUrlElement = container.querySelector(`meta[property="og:url"]`);

    expect(titleElement?.innerHTML).toBe(title);
    expect(metaDescriptionElement?.getAttribute("content")).toBe(description);
    expect(metaOgTitleElement?.getAttribute("content")).toBe(ogTitle);
    expect(metaOgDescriptionElement?.getAttribute("content")).toBe(
      ogDescription,
    );
    expect(metaOgUrlElement?.getAttribute("content")).toBe(ogUrl);
  });
});
