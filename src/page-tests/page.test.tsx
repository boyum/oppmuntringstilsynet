import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { cookies, headers } from "next/headers";
import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import { encodeV3 } from "../utils/encoding-utils-v3";
import { encodeV4 } from "../utils/encoding-utils-v4";
import { getTranslations } from "../utils/translations-utils";
import {
  QUERY_PARAM_MESSAGE_KEY_V3,
  QUERY_PARAM_MESSAGE_KEY_V4,
} from "../utils/url-utils";

jest.mock("next/navigation", () => require("next-router-mock/navigation"));
jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

expect.extend(toHaveNoViolations);

import Page, { generateMetadata } from "../app/page";

const mockedHeaders = headers as jest.Mock;
const mockedCookies = cookies as jest.Mock;

function mockHeaders(overrides: Record<string, string | null> = {}): void {
  const store = new Map(
    Object.entries({
      host: "example.com",
      "x-forwarded-proto": "https",
      "accept-language": "en",
      "user-agent": "",
      ...overrides,
    }),
  );

  mockedHeaders.mockResolvedValue({
    get: (name: string) => store.get(name) ?? null,
  });
}

function mockCookies(values: Record<string, string> = {}): void {
  mockedCookies.mockResolvedValue({
    get: (name: string) =>
      values[name] === undefined ? undefined : { value: values[name] },
  });
}

describe(Page.name, () => {
  it("should render the home page with the user's language", async () => {
    mockHeaders();
    mockCookies();

    const page = render(
      await Page({ searchParams: Promise.resolve({}) }),
    ).container;

    const h1 = page.querySelector("h1");
    expect(h1?.textContent).toBe(getTranslations(Language.English).formHeading);
  });

  it("should render the home page with a message from the query parameters", async () => {
    mockHeaders();
    mockCookies();

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

    expect(
      (page.querySelector("#date-field") as HTMLInputElement | null)?.value,
    ).toBe("1st of January");
    expect(
      (page.querySelector("#name-field") as HTMLInputElement | null)?.value,
    ).toBe("Sindre");
  });

  it("should use the language cookie if it is set", async () => {
    mockHeaders();
    mockCookies({ language: Language.NorskBokmal });

    const page = render(
      await Page({ searchParams: Promise.resolve({}) }),
    ).container;

    const h1 = page.querySelector("h1");
    expect(h1?.textContent).toBe(
      getTranslations(Language.NorskBokmal).formHeading,
    );
  });

  it("should fall back to the default language when there is no accept-language header", async () => {
    mockHeaders({ "accept-language": null });
    mockCookies();

    const page = render(
      await Page({ searchParams: Promise.resolve({}) }),
    ).container;

    const h1 = page.querySelector("h1");
    expect(h1?.textContent).toBe(getTranslations(Language.English).formHeading);
  });

  it("should render the home page when there is no host header", async () => {
    mockHeaders({ host: "" });
    mockCookies();

    const page = render(
      await Page({ searchParams: Promise.resolve({}) }),
    ).container;

    const h1 = page.querySelector("h1");
    expect(h1?.textContent).toBe(getTranslations(Language.English).formHeading);
  });

  it("should render without accessibility errors", async () => {
    mockHeaders();
    mockCookies();

    const page = render(
      await Page({ searchParams: Promise.resolve({}) }),
    ).container;

    const results = await axe(page);
    expect(results).toHaveNoViolations();
  });
});

describe(generateMetadata.name, () => {
  it("should build the metadata from the page props", async () => {
    mockHeaders();
    mockCookies();

    const metadata = await generateMetadata({
      searchParams: Promise.resolve({}),
    });

    expect(metadata.title).toBe(getTranslations(Language.English).pageTitle);
    expect(metadata.openGraph?.url).toBe("https://example.com/");
  });

  it("should include the encoded message in the og image URL", async () => {
    mockHeaders();
    mockCookies();

    const message: Message = {
      date: "1st of January",
      message: "Hi, tester!",
      checks: [true, true, true],
      name: "Sindre",
      language: Language.English,
      themeName: "pride",
    };
    const encodedMessageV4 = encodeV4(message);

    const metadata = await generateMetadata({
      searchParams: Promise.resolve({
        [QUERY_PARAM_MESSAGE_KEY_V4]: encodedMessageV4,
      }),
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: `https://example.com/api/og-image?${QUERY_PARAM_MESSAGE_KEY_V4}=${encodedMessageV4}`,
        width: 1200,
        height: 627,
        alt: getTranslations(Language.English).pageOgTitle,
      },
    ]);
  });
});
