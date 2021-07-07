import http from "http";
import { useContext, useEffect } from "react";
import LanguageContext from "../../contexts/LanguageContext";
import ThemeContext from "../../contexts/ThemeContext";
import { ThemeActionType } from "../../reducers/theme.reducer";
import Message from "../../types/Message";
import { themes } from "../../types/Themes";
import { getTheme, setActiveTheme, setPageTheme } from "../../utils/theme-utils";
import { getTranslations } from "../../utils/translations-utils";
import { decodeMessage } from "../../utils/url-utils";
import styles from "./SocialMediaPreview.module.scss";

type Props = {
  message: Message | null;
};

export default function SocialMediaPreview({ message }: Props): JSX.Element {
  const [language] = useContext(LanguageContext);
  const [theme, dispatchThemeAction] = useContext(ThemeContext);

  const translations = getTranslations(message?.language ?? language);

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
  }, [message]);

  return (
    <main className={styles.main}>
      <div className={styles.previewContainer}>
        <h1 className={styles.heading}>{title}</h1>
      </div>
    </main>
  );
}

type Context = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  resolvedUrl: string;
  query: {
    [key: string]: string;
  };
};

export async function getServerSideProps(
  context: Context,
): Promise<{ props: Props }> {
  const message = decodeMessage(context.query.m ?? "");

  const serverSideProps: { props: Props } = {
    props: {
      message,
    },
  };

  return serverSideProps;
}
