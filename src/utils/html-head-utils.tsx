import LanguageEnum from "../enums/Language";
import { getTranslations } from "./translations-utils";
import { HtmlHeadData } from "../reducers/html-head.reducer";

export function getDefaultHtmlHeadData(
  language: LanguageEnum,
  url: string,
): HtmlHeadData {
  const { pageTitle, pageOgTitle, pageDescription } = getTranslations(language);

  return {
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageOgTitle,
    ogDescription: pageDescription,
    ogUrl: url,
    encodedMessage: null,
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
  const previewImageUrl = `/api/social-media-preview${
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
