import type { ReactNode } from "react";
import type { LanguageEnum } from "../enums/Language";
import { getTranslations } from "./translations-utils";

export type HtmlHeadData = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  encodedMessage: string | null;
  deployUrl: string;
};

export function getDefaultHtmlHeadData(
  language: LanguageEnum,
  url: string,
  encodedMessage: string | null,
  deployUrl: string,
): HtmlHeadData {
  const { pageTitle, pageOgTitle, pageDescription } = getTranslations(language);

  return {
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageOgTitle,
    ogDescription: pageDescription,
    ogUrl: url,
    encodedMessage,
    deployUrl,
  };
}

export function renderHtmlHead({
  title,
  description,
  ogTitle,
  ogDescription,
  ogUrl,
  encodedMessage,
  deployUrl,
}: HtmlHeadData): ReactNode {
  const ogImageUrl = `${deployUrl}/api/og-image${
    encodedMessage ? `?m=${encodedMessage}` : ""
  }`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      <meta property="og:image:alt" content={ogTitle} />
    </>
  );
}
