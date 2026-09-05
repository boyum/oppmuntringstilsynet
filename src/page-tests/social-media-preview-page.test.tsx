import { render } from "@testing-library/react";
import { headers } from "next/headers";
import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import { encodeV3 } from "../utils/encoding-utils-v3";
import { getShareTitle } from "../utils/share-utils";
import { getTranslations } from "../utils/translations-utils";
import { QUERY_PARAM_MESSAGE_KEY_V3 } from "../utils/url-utils";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

import Page, { generateMetadata } from "../app/social-media-preview/page";

const mockedHeaders = headers as jest.Mock;

function mockHeaders(acceptLanguage: string | null): void {
  mockedHeaders.mockResolvedValue({
    get: (name: string) => (name === "accept-language" ? acceptLanguage : null),
  });
}

describe(Page.name, () => {
  it("should render the preview with the user's language", async () => {
    mockHeaders("no");

    const page = render(
      await Page({ searchParams: Promise.resolve({}) }),
    ).container;

    const heading = page.querySelector("h1");
    expect(heading?.textContent).toBe(
      getTranslations(Language.NorskBokmal).previewTitleWithoutMessage,
    );
  });

  it("should fall back to the default language when there is no accept-language header", async () => {
    mockHeaders(null);

    const page = render(
      await Page({ searchParams: Promise.resolve({}) }),
    ).container;

    const heading = page.querySelector("h1");
    expect(heading?.textContent).toBe(
      getTranslations(Language.English).previewTitleWithoutMessage,
    );
  });

  it("should render the preview with a message from the query parameters", async () => {
    mockHeaders("no");

    const message: Message = {
      date: "1st of January",
      message: "Hi, tester!",
      checks: [true, true, true],
      name: "Sindre",
      language: Language.English,
      themeName: "pride",
    };
    const encodedMessage = encodeV3(message);

    const page = render(
      await Page({
        searchParams: Promise.resolve({
          [QUERY_PARAM_MESSAGE_KEY_V3]: encodedMessage,
        }),
      }),
    ).container;

    const heading = page.querySelector("h1");
    expect(heading?.textContent).toBe(getShareTitle(message));
  });
});

describe(generateMetadata.name, () => {
  it("should build the metadata from the preferred language", async () => {
    mockHeaders("no");

    const metadata = await generateMetadata({
      searchParams: Promise.resolve({}),
    });

    expect(metadata.title).toBe(
      getTranslations(Language.NorskBokmal).pageTitle,
    );
    expect(metadata.openGraph?.url).toBe("/social-media-preview");
  });
});
