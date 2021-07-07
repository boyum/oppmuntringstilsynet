import dotenv from "dotenv";
import LanguageEnum from "../enums/Language";
import { HtmlHeadData } from "../reducers/html-head.reducer";
import { getTranslations } from "./translations-utils";

export function getDefaultHtmlHeadData(
  language: LanguageEnum,
  url: string,
  encodedMessage: string | null,
): HtmlHeadData {
  const { pageTitle, pageOgTitle, pageDescription } = getTranslations(language);

  return {
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageOgTitle,
    ogDescription: pageDescription,
    ogUrl: url,
    encodedMessage,
  };
}

export function renderHtmlHead({
  title,
  description,
  ogTitle,
  ogDescription,
  ogUrl,
  encodedMessage,
}: HtmlHeadData): JSX.Element {
  let url;

  const isClient = typeof window === "object";
  if (isClient) {
    url = window.location.origin;
  } else {
    dotenv.config();

    const localUrl = "http://localhost:3000";
    url = process.env.DEPLOY_URL ?? localUrl;
  }

  const previewImageUrl = `${url}/api/get-social-media-preview-image${
    encodedMessage ? `?m=${encodedMessage}` : ""
  }`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={previewImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      <meta property="og:image:alt" content={ogTitle} />
    </>
  );
}
