import parser from "accept-language-parser";
import type { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import type { LanguageEnum } from "../../enums/Language";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import type { Message } from "../../types/Message";
import { getPreferredLanguage } from "../../utils/language-utils";
import {
  getFallbackTheme,
  getTheme,
  setPageThemeStyles,
  storeThemeInCookie,
} from "../../utils/theme-utils";
import { getTranslations } from "../../utils/translations-utils";
import { getEncodedAndDecodedMessage } from "../../utils/url-utils";
import styles from "./SocialMediaPreview.module.scss";
import { LanguageContext } from "../../contexts/LanguageContext";
import { ThemeContext } from "../../contexts/ThemeContext";

export type SocialMediaPreviewProps = {
  message: Message | null;
  preferredLanguage: LanguageEnum;
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
    ? translations.previewTitleWithMessage.replace(
        /\{name\}/g,
        message.name || translations.someone,
      )
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
  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

  return {
    props: {
      message: decodedMessage,
      preferredLanguage,
    },
  } satisfies { props: SocialMediaPreviewProps };
}

export default SocialMediaPreview;
