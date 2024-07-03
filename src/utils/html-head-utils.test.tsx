import { act } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { LanguageEnum } from "../enums/Language";
import type { HtmlHeadData } from "../reducers/html-head.reducer";
import { TranslationsNb } from "../types/Translations.nb";
import { getDefaultHtmlHeadData, renderHtmlHead } from "./html-head-utils";

describe(getDefaultHtmlHeadData.name, () => {
  it("should return html head data corresponding to the current language", () => {
    const ogUrl = "url";
    const encodedMessage = "encodedMessage";
    const deployUrl = "deployUrl";

    const language = LanguageEnum.NorskBokmal;

    const expectedData: HtmlHeadData = {
      title: TranslationsNb.pageTitle,
      ogTitle: TranslationsNb.pageOgTitle,
      description: TranslationsNb.pageDescription,
      ogDescription: TranslationsNb.pageDescription,
      ogUrl,
      encodedMessage,
      deployUrl,
    };

    const actualData = getDefaultHtmlHeadData(
      language,
      ogUrl,
      encodedMessage,
      deployUrl,
    );

    expect(actualData).toEqual(expectedData);
  });
});

describe(renderHtmlHead.name, () => {
  it("should render meta tags", () => {
    const data: HtmlHeadData = {
      title: "title",
      ogTitle: "ogTitle",
      description: "description",
      ogDescription: "ogDescription",
      ogUrl: "url",
      deployUrl: "deployUrl",
      encodedMessage: "encodedMessage",
    };

    const container = document.createElement("div");

    act(() => {
      createRoot(container).render(renderHtmlHead(data));
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

    expect(titleElement?.innerHTML).toBe(data.title);
    expect(metaDescriptionElement?.getAttribute("content")).toBe(
      data.description,
    );
    expect(metaOgTitleElement?.getAttribute("content")).toBe(data.ogTitle);
    expect(metaOgDescriptionElement?.getAttribute("content")).toBe(
      data.ogDescription,
    );
    expect(metaOgUrlElement?.getAttribute("content")).toBe(data.ogUrl);
  });
});
