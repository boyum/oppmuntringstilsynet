import type { Metadata } from "next";
import type { Language } from "../enums/Language";
import { getTranslations } from "./translations-utils";
import { LATEST_QUERY_PARAM_MESSAGE_KEY } from "./url-utils";

type MetadataData = {
  language: Language;
  ogUrl: string;
  deployUrl: string;
  encodedMessage: string | null;
};

export function getMetadata({
  language,
  ogUrl,
  deployUrl,
  encodedMessage,
}: MetadataData): Metadata {
  const { pageTitle, pageOgTitle, pageDescription } = getTranslations(language);

  const ogImageUrl = `${deployUrl}/api/og-image${
    encodedMessage ? `?${LATEST_QUERY_PARAM_MESSAGE_KEY}=${encodedMessage}` : ""
  }`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageOgTitle,
      description: pageDescription,
      url: ogUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 627,
          alt: pageOgTitle,
        },
      ],
      type: "website",
    },
    icons: {
      icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>",
    },
  };
}
