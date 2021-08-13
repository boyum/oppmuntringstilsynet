import parser from "accept-language-parser";
import first from "lodash.first";
import { GetServerSidePropsContext } from "next";
import { useContext, useEffect } from "react";
import LanguageContext from "../../contexts/LanguageContext";
import ThemeContext from "../../contexts/ThemeContext";
import LanguageEnum from "../../enums/Language";
import { ThemeActionType } from "../../reducers/theme.reducer";
import Message from "../../types/Message";
import { themes } from "../../types/Themes";
import { getPreferredLanguage } from "../../utils/language-utils";
import {
  getTheme,
  setActiveTheme,
  setPageTheme,
} from "../../utils/theme-utils";
import { getTranslations } from "../../utils/translations-utils";
import { decodeMessage } from "../../utils/url-utils";
import styles from "./SocialMediaPreview.module.scss";

type Props = {
  message: Message | null;
  preferredLanguage: LanguageEnum;
};

export default function SocialMediaPreview({
  message,
  preferredLanguage,
}: Props): JSX.Element {
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
      ? getTheme(message.themeName, themes)
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
    <main className={styles.main}>
      <div className={styles.previewContainer}>
        <h1 className={styles.heading}>{title}</h1>
      </div>
    </main>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: Props }> {
  const encodedMessage = Array.isArray(context.query.m)
    ? first(context.query.m)
    : context.query.m;
  const message = decodeMessage(encodedMessage ?? "");

  const acceptLanguage = context.req.headers["accept-language"] ?? "";
  const acceptedLanguages = parser
    .parse(acceptLanguage)
    .map(language => language.code);
  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

  const serverSideProps: { props: Props } = {
    props: {
      message,
      preferredLanguage,
    },
  };

  return serverSideProps;
}
