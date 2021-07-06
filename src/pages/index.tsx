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
import MessageContext from "../contexts/MessageContext";
import LanguageEnum from "../enums/Language";
import {
  HtmlHeadActionType,
  htmlHeadReducer,
} from "../reducers/html-head.reducer";
import { LanguageActionType } from "../reducers/language.reducer";
import { MessageActionType } from "../reducers/message.reducer";
import styles from "../styles/Home.module.scss";
import { themes } from "../types/Themes";
import { encodeAndCopyMessage } from "../utils/clipboard-utils";
import {
  getDefaultHtmlHeadData,
  renderHtmlHead,
} from "../utils/html-head-utils";
import { isEmpty } from "../utils/message-utils";
import {
  getActiveTheme,
  getTheme,
  setActiveTheme,
  setPageTheme,
} from "./api/theme";
import { getTranslations } from "./api/translations";
import { decodeMessage } from "./api/url";

type Props = {
  encodedParamMessage: string;
  resolvedUrl: string;
};

export default function Home({
  encodedParamMessage,
  resolvedUrl,
}: Props): JSX.Element {
  const [language, dispatchLanguageAction] = useContext(LanguageContext);
  const [message, dispatchMessageAction] = useContext(MessageContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [htmlHeadData, dispatchHtmlHeadAction] = useReducer(
    htmlHeadReducer,
    getDefaultHtmlHeadData(language, resolvedUrl),
  );

  const router = useRouter();
  const tempInput = useRef<HTMLInputElement>(null);

  const messageFromUrl = decodeMessage(encodedParamMessage);
  const translations = getTranslations(language);

  useEffect(() => {
    if (!!messageFromUrl && isEmpty(message) && !isResetting) {
      dispatchMessageAction?.({
        type: MessageActionType.SetMessage,
        message: messageFromUrl,
      });

      dispatchLanguageAction?.({
        type: LanguageActionType.SetLanguage,
        language: messageFromUrl.language,
      });

      dispatchHtmlHeadAction({
        type: HtmlHeadActionType.SetHtmlHeadData,
        data: {
          ...getDefaultHtmlHeadData(messageFromUrl.language, resolvedUrl),
          ogTitle: translations.pageTitleWithMessage.replace(
            /\{name\}/g,
            messageFromUrl.name,
          ),
        },
      });

      setIsDisabled(true);
    }

    if (messageFromUrl?.themeName) {
      const theme = getTheme(messageFromUrl.themeName, themes);
      setPageTheme(theme);
      setActiveTheme(theme.name);
    } else {
      const activeTheme = getActiveTheme(themes);
      setPageTheme(activeTheme);

      dispatchMessageAction?.({
        type: MessageActionType.SetTheme,
        themeName: activeTheme.name,
      });
    }
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

  return (
    <>
      <Head>{renderHtmlHead(htmlHeadData)}</Head>
      <div className={styles.themePickerButtonWrapper}>
        <ThemePicker
          themes={themes}
          setTheme={theme => {
            setPageTheme(theme);
            setActiveTheme(theme.name);
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

          <Form isDisabled={isDisabled} />
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
  const serverSideProps: { props: Props } = {
    props: {
      resolvedUrl: context.resolvedUrl,
      encodedParamMessage: context.query.m ?? "",
    },
  };

  return serverSideProps;
}
