import parser from "accept-language-parser";
import deepEqual from "deep-equal";
import dotenv from "dotenv";
import http from "http";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import Buttons from "../components/Buttons";
import Footer from "../components/Footer";
import Form from "../components/Form";
import LanguagePicker from "../components/LanguagePicker";
import { ThemePicker } from "../components/ThemePicker/ThemePicker";
import LanguageContext from "../contexts/LanguageContext";
import ThemeContext from "../contexts/ThemeContext";
import LanguageEnum from "../enums/Language";
import { LanguageActionType } from "../reducers/language.reducer";
import {
  getEmptyState,
  MessageActionType,
  messageReducer,
} from "../reducers/message.reducer";
import { ThemeActionType } from "../reducers/theme.reducer";
import styles from "../styles/Home.module.scss";
import Message from "../types/Message";
import { themes } from "../types/Themes";
import { encodeAndCopyMessage } from "../utils/clipboard-utils";
import {
  getDefaultHtmlHeadData,
  renderHtmlHead,
} from "../utils/html-head-utils";
import { getPreferredLanguage } from "../utils/language-utils";
import { isEmpty } from "../utils/message-utils";
import { getTheme, setActiveTheme, setPageTheme } from "../utils/theme-utils";
import { getTranslations } from "../utils/translations-utils";
import { decodeMessage } from "../utils/url-utils";

type Props = {
  encodedMessage: string | null;
  messageFromUrl: Message | null;
  resolvedUrl: string;
  deployUrl: string;
  preferredLanguage: LanguageEnum;
};

export default function Home({
  encodedMessage,
  messageFromUrl,
  resolvedUrl,
  deployUrl,
  preferredLanguage,
}: Props): JSX.Element {
  const [language, dispatchLanguageAction] = useContext(LanguageContext);
  const [theme, dispatchThemeAction] = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, dispatchMessageAction] = useReducer(
    messageReducer,
    messageFromUrl ?? getEmptyState(),
  );

  const translations = getTranslations(messageFromUrl?.language ?? language);

  const htmlHeadData = getDefaultHtmlHeadData(
    messageFromUrl?.language ?? language,
    `${deployUrl}${resolvedUrl}`,
    encodedMessage,
    deployUrl,
  );

  const router = useRouter();
  const tempInput = useRef<HTMLInputElement>(null);

  const shouldSetMessage =
    isEmpty(message) && !deepEqual(messageFromUrl, message) && !isResetting;

  useEffect(() => {
    if (!!messageFromUrl && shouldSetMessage) {
      dispatchMessageAction({
        type: MessageActionType.SetMessage,
        message: messageFromUrl,
      });

      setIsDisabled(true);
    }
  }, [messageFromUrl]);

  useEffect(() => {
    const activeTheme = messageFromUrl?.themeName
      ? getTheme(messageFromUrl.themeName, themes)
      : theme;

    if (messageFromUrl?.themeName) {
      setActiveTheme(activeTheme.name);
    } else {
      dispatchMessageAction({
        type: MessageActionType.SetTheme,
        themeName: activeTheme.name,
      });
    }

    setPageTheme(activeTheme);

    dispatchThemeAction({
      type: ThemeActionType.SetTheme,
      themeName: activeTheme.name,
    });

    dispatchLanguageAction({
      type: LanguageActionType.SetLanguage,
      language: messageFromUrl?.language ?? preferredLanguage,
    });
  }, []);

  function handleCopy() {
    if (tempInput.current) {
      encodeAndCopyMessage(message, tempInput.current);
    }
  }

  function handleReset() {
    router.push("/");

    dispatchMessageAction?.({
      type: MessageActionType.ResetEverythingButTheme,
    });

    setIsResetting(true);
    setIsDisabled(false);
  }

  function handleLanguageChange(newLanguage: LanguageEnum) {
    dispatchMessageAction?.({
      type: MessageActionType.SetMessage,
      message: {
        language: newLanguage,
      },
    });
  }

  function handleSetMessage(newMessage: Partial<Message>): void {
    dispatchMessageAction({
      type: MessageActionType.SetMessage,
      message: newMessage,
    });
  }

  function handleSetCheck(checkValue: boolean, checkIndex: number): void {
    dispatchMessageAction({
      type: MessageActionType.SetCheck,
      check: checkValue,
      checkIndex,
    });
  }

  return (
    <>
      <Head>{renderHtmlHead(htmlHeadData)}</Head>
      <div className={styles.themePickerButtonWrapper}>
        <ThemePicker
          themes={themes}
          setTheme={newTheme => {
            setPageTheme(newTheme);
            setActiveTheme(newTheme.name);
            dispatchMessageAction({
              type: MessageActionType.SetTheme,
              themeName: newTheme.name,
            });
          }}
        />
      </div>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <h1 className={styles.heading}>{translations.formHeading}</h1>
            <div className={styles.languagePickerContainer}>
              <LanguagePicker handleChange={handleLanguageChange} />
            </div>
          </div>

          <Form
            isDisabled={isDisabled}
            message={message}
            setMessage={handleSetMessage}
            setCheck={handleSetCheck}
          />
          <Buttons handleReset={handleReset} handleCopy={handleCopy} />
          <label className="hidden">
            Hidden label used for copying
            <input ref={tempInput} type="text" readOnly tabIndex={-1} />
          </label>
        </div>
      </main>
      <Footer />
    </>
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
  const messageFromUrl = decodeMessage(context.query.m ?? "");
  dotenv.config();

  const localUrl = "http://localhost:3000";
  const deployUrl = process.env.DEPLOY_URL ?? localUrl;

  const { host } = context.req.headers;
  const acceptLanguage = context.req.headers["accept-language"] ?? "";
  const acceptedLanguages = parser
    .parse(acceptLanguage)
    .map(language => language.code);
  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

  const serverSideProps: { props: Props } = {
    props: {
      encodedMessage: context.query.m || null,
      messageFromUrl,
      resolvedUrl: context.resolvedUrl,
      deployUrl: host ? `//${host}` : deployUrl,
      preferredLanguage,
    },
  };

  return serverSideProps;
}
