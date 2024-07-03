import { ImageResponse } from "@vercel/og";
import parser from "accept-language-parser";
import type { NextRequest } from "next/server";
import { defaultLanguage } from "../../contexts/LanguageContext";
import type { LanguageEnum } from "../../enums/Language";
import type { Message } from "../../types/Message";
import { randomArrayValue } from "../../utils/array-utils";
import { getPreferredLanguage } from "../../utils/language-utils";
import { getTranslations } from "../../utils/translations-utils";
import { decodeMessage } from "../../utils/url-utils";

export type SocialMediaPreviewProps = {
  message: Message | null;
  preferredLanguage: LanguageEnum;
};

export const config = {
  runtime: "edge",
};

const OgImage = (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const encodedMessage = searchParams.get("m");
  const message = encodedMessage ? decodeMessage(encodedMessage) : null;

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const acceptedLanguages = parser
    .parse(acceptLanguage)
    .map(language => language.code);

  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

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
};

export default OgImage;
