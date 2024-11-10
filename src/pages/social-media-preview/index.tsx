import parser from "accept-language-parser";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import type { Language } from "../../enums/Language";
import type { Message } from "../../types/Message";
import { getFirstAcceptedLanguage } from "../../utils/language-utils";
import { getShareTitle } from "../../utils/share-utils";
import {
  getFallbackTheme,
  getTheme,
  setPageThemeStyles,
  storeThemeInCookie,
} from "../../utils/theme-utils";
import { getTranslations } from "../../utils/translations-utils";
import { getEncodedAndDecodedMessage } from "../../utils/url-utils";
import styles from "./SocialMediaPreview.module.scss";

export type SocialMediaPreviewProps = {
  message: Message | null;
  preferredLanguage: Language;
};

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({
  message,
  preferredLanguage,
}) => {
  const [language, setLanguage] = useState(
    message?.language ?? preferredLanguage,
  );
  const [theme, setTheme] = useState(
    message?.themeName ? getTheme(message.themeName) : getFallbackTheme(),
  );

  const translations = getTranslations(
    message?.language ?? preferredLanguage ?? language,
  );

  const title = message
    ? getShareTitle(message)
    : translations.previewTitleWithoutMessage;

  useEffect(() => {
    const activeTheme = message?.themeName
      ? getTheme(message.themeName)
      : theme;

    if (message?.themeName) {
      storeThemeInCookie(message.themeName);
    }

    setPageThemeStyles(activeTheme);
    setTheme(activeTheme);
  }, [message, setTheme, theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <LanguageContext.Provider value={[language, setLanguage]}>
        <Head>
          {/* By inserting a `body` element in `Head`, we can add properties to the body */}
          <body data-theme={theme.name} />
        </Head>
        <main className={styles["main"]}>
          <div className={styles["preview-container"]}>
            <h1 className={styles["heading"]}>{title}</h1>
          </div>
        </main>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

function getQueryParams(resolvedUrl: string): URLSearchParams {
  const [, ...queryParams] = resolvedUrl.split("?");

  return new URLSearchParams(queryParams.join());
}

function getAcceptedLanguages(acceptLanguage: string): string[] {
  return parser.parse(acceptLanguage).map(language => language.code);
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: SocialMediaPreviewProps }> {
  const { req, resolvedUrl } = context;

  const queryParams = getQueryParams(resolvedUrl);
  const [, decodedMessage] = getEncodedAndDecodedMessage(queryParams);

  const { "accept-language": acceptLanguageHeader } = req.headers;

  const acceptedLanguages = getAcceptedLanguages(acceptLanguageHeader ?? "");
  const preferredLanguage = getFirstAcceptedLanguage(acceptedLanguages);

  return {
    props: {
      message: decodedMessage,
      preferredLanguage,
    },
  } satisfies { props: SocialMediaPreviewProps };
}

export default SocialMediaPreview;
