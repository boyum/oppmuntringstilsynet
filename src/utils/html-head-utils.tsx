import LanguageEnum from "../enums/Language";
import { getTranslations } from "../pages/api/translations";
import { HtmlHeadData } from "../reducers/html-head.reducer";

export function getDefaultHtmlHeadData(
  language: LanguageEnum,
  url: string,
): HtmlHeadData {
  const { pageTitleEmptyMessage, pageDescription } = getTranslations(language);

  return {
    title: pageTitleEmptyMessage,
    description: pageDescription,
    ogTitle: pageTitleEmptyMessage,
    ogDescription: pageDescription,
    ogUrl: url,
  };
}

export function renderHtmlHead({
  title,
  description,
  ogTitle,
  ogDescription,
  ogUrl,
}: HtmlHeadData): JSX.Element {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
    </>
  );
}
