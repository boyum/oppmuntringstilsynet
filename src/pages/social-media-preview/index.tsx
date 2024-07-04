import parser from "accept-language-parser";
import type { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import type { LanguageEnum } from "../../enums/Language";
import { ThemeActionType } from "../../reducers/theme.reducer";
import type { Message } from "../../types/Message";
import { getPreferredLanguage } from "../../utils/language-utils";
import {
  getTheme,
  setActiveTheme,
  setPageTheme,
} from "../../utils/theme-utils";
import { getTranslations } from "../../utils/translations-utils";
import { decodeMessage } from "../../utils/url-utils";
import styles from "./SocialMediaPreview.module.scss";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";

export type SocialMediaPreviewProps = {
  message: Message | null;
  preferredLanguage: LanguageEnum;
};

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({
  message,
  preferredLanguage,
}) => {
  const [language] = useLanguage();
  const [theme, dispatchThemeAction] = useTheme();

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
      setActiveTheme(message.themeName);
    }

    setPageTheme(activeTheme);

    dispatchThemeAction({
      type: ThemeActionType.SetTheme,
      themeName: activeTheme.name,
    });
  }, [message, dispatchThemeAction, theme]);

  return (
    <main className={styles["main"]}>
      <div className={styles["preview-container"]}>
        <h1 className={styles["heading"]}>{title}</h1>
      </div>
    </main>
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
  const encodedMessage = queryParams.get("m");
  const messageFromUrl = decodeMessage(encodedMessage ?? "");

  const { "accept-language": acceptLanguageHeader } = req.headers;

  const acceptedLanguages = getAcceptedLanguages(acceptLanguageHeader ?? "");
  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

  return {
    props: {
      message: messageFromUrl,
      preferredLanguage,
    },
  } satisfies { props: SocialMediaPreviewProps };
}

export default SocialMediaPreview;
