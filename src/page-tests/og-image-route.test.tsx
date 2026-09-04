import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { Children, type ReactElement, type ReactNode } from "react";
import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import { TranslationsEn } from "../types/Translations.en";
import { TranslationsNb } from "../types/Translations.nb";
import { encodeV3 } from "../utils/encoding-utils-v3";
import { QUERY_PARAM_MESSAGE_KEY_V3 } from "../utils/url-utils";

jest.mock("@vercel/og", () => ({
  ImageResponse: jest.fn(),
}));

import { GET } from "../app/api/og-image/route";

const MockImageResponse = ImageResponse as unknown as jest.Mock;

type TestElement = ReactElement<{ children?: ReactNode }>;

const message: Message = {
  date: "1st of January",
  message: "Hi, tester!",
  checks: [true, true, true],
  name: "Sindre",
  language: Language.English,
  themeName: "pride",
};

function createRequest(url: string, acceptLanguage?: string): NextRequest {
  const headers = new Headers();
  if (acceptLanguage) {
    headers.set("accept-language", acceptLanguage);
  }

  return { url, headers } as unknown as NextRequest;
}

function getTitleFromResponse(): string {
  const jsx = MockImageResponse.mock.calls[0][0] as TestElement;
  const card = Children.toArray(jsx.props.children)[0] as TestElement;
  const heading = Children.toArray(card.props.children)[0] as TestElement;
  const [title] = Children.toArray(heading.props.children);

  return title as string;
}

describe("GET /api/og-image", () => {
  beforeEach(() => {
    MockImageResponse.mockClear();
  });

  it("should use the message's language and name in the title", () => {
    const encodedMessage = encodeV3(message);
    const url = `http://localhost/api/og-image?${QUERY_PARAM_MESSAGE_KEY_V3}=${encodedMessage}`;

    GET(createRequest(url, "no"));

    expect(MockImageResponse).toHaveBeenCalledTimes(1);
    expect(MockImageResponse.mock.calls[0][1]).toEqual({
      width: 1200,
      height: 630,
    });
    expect(getTitleFromResponse()).toBe(
      TranslationsEn.previewTitleWithMessage.replace("{name}", "Sindre"),
    );
  });

  it("should use the accepted language when there is no message", () => {
    GET(createRequest("http://localhost/api/og-image", "nb"));

    expect(getTitleFromResponse()).toBe(
      TranslationsNb.previewTitleWithoutMessage,
    );
  });

  it("should fall back to the default language when there is no message or accepted languages", () => {
    GET(createRequest("http://localhost/api/og-image"));

    expect(getTitleFromResponse()).toBe(
      TranslationsEn.previewTitleWithoutMessage,
    );
  });

  it("should pick one of the available emojis", () => {
    GET(createRequest("http://localhost/api/og-image", "nb"));

    const jsx = MockImageResponse.mock.calls[0][0] as TestElement;
    const card = Children.toArray(jsx.props.children)[0] as TestElement;
    const heading = Children.toArray(card.props.children)[0] as TestElement;
    const [, , emoji] = Children.toArray(heading.props.children);

    expect(["💛", "🥰", "😻", "💐", "🫶"]).toContain(emoji);
  });
});
