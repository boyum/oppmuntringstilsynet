import { ImageResponse } from "@vercel/og";
import parser from "accept-language-parser";
import type { NextRequest } from "next/server";
import { randomArrayValue } from "../../../utils/array-utils";
import {
  defaultLanguage,
  getFirstAcceptedLanguage,
} from "../../../utils/language-utils";
import { getTranslations } from "../../../utils/translations-utils";
import { getEncodedAndDecodedMessage } from "../../../utils/url-utils";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const [, message] = getEncodedAndDecodedMessage(searchParams);

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const acceptedLanguages = parser
    .parse(acceptLanguage)
    .map(language => language.code);

  const preferredLanguage = getFirstAcceptedLanguage(acceptedLanguages);

  let translations;
  let title;
  if (message) {
    translations = getTranslations(
      message.language ?? preferredLanguage ?? defaultLanguage,
    );

    title = translations.previewTitleWithMessage.replace(
      /\{name\}/g,
      message.name || translations.someone,
    );
  } else {
    translations = getTranslations(preferredLanguage ?? defaultLanguage);
    title = translations.previewTitleWithoutMessage;
  }

  const emoji = randomArrayValue(["💛", "🥰", "😻", "💐", "🫶"]);

  return new ImageResponse(
    <main
      style={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100vh",
        justifyContent: "center",
        padding: "0 1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "hsl(353, 53%, 54%)",
          border: "0.125rem solid",
          borderRadius: "0.5em",
          boxShadow: " 0 0 10px 0 rgba(0, 0, 0, 0.15)",
          color: "white",
          display: "flex",
          padding: "4rem 6rem 5rem",
        }}
      >
        <h1
          style={{
            display: "flex",
            fontSize: "36px",
            margin: 0,
            textAlign: "center",
          }}
        >
          {title} {emoji}
        </h1>
      </div>
    </main>,
    {
      width: 1200,
      height: 630,
    },
  );
}
