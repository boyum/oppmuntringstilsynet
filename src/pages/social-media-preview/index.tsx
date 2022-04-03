import parser from "accept-language-parser";
import first from "lodash.first";
import type { GetServerSidePropsContext } from "next";
import { useContext, useEffect } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { ThemeContext } from "../../contexts/ThemeContext";
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

export type SocialMediaPreviewProps = {
  message: Message | null;
  preferredLanguage: LanguageEnum;
};

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({
  message,
  preferredLanguage,
}) => {
  const [language] = useContext(LanguageContext);
  const [theme, dispatchThemeAction] = useContext(ThemeContext);

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

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: SocialMediaPreviewProps }> {
  const encodedMessage = Array.isArray(context.query["m"])
    ? first(context.query["m"])
    : context.query["m"];
  const message = decodeMessage(encodedMessage ?? "");

  const acceptLanguage = context.req.headers["accept-language"] ?? "";
  const acceptedLanguages = parser
    .parse(acceptLanguage)
    .map(language => language.code);
  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

  const serverSideProps: { props: SocialMediaPreviewProps } = {
    props: {
      message,
      preferredLanguage,
    },
  };

  return serverSideProps;
}

// eslint-disable-next-line import/no-default-export
export default SocialMediaPreview;
