import parser from "accept-language-parser";
import deepEqual from "deep-equal";
import dotenv from "dotenv";
import first from "lodash.first";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Buttons } from "../components/Buttons/Buttons";
import { Footer } from "../components/Footer/Footer";
import { Form } from "../components/Form/Form";
import { LanguagePicker } from "../components/LanguagePicker/LanguagePicker";
import { ThemePicker } from "../components/ThemePicker/ThemePicker";
import { LanguageContext } from "../contexts/LanguageContext";
import { ThemeContext } from "../contexts/ThemeContext";
import type { LanguageEnum } from "../enums/Language";
import { LanguageActionType } from "../reducers/language.reducer";
import {
  MessageActionType,
  getEmptyState,
  messageReducer,
} from "../reducers/message.reducer";
import { ThemeActionType } from "../reducers/theme.reducer";
import styles from "../styles/Home.module.scss";
import type { Message } from "../types/Message";
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

const Home: FC<Props> = ({
  encodedMessage,
  messageFromUrl,
  resolvedUrl,
  deployUrl,
  preferredLanguage,
}) => {
  const [language, dispatchLanguageAction] = useContext(LanguageContext);
  const [theme, dispatchThemeAction] = useContext(ThemeContext);
  const [isResetting, setIsResetting] = useState(false);
  const [message, dispatchMessageAction] = useReducer(
    messageReducer,
    messageFromUrl ?? getEmptyState(),
  );
  const [forcedLanguage, setForcedLanguage] = useState<LanguageEnum | null>(
    null,
  );
  const router = useRouter();
  const tempInput = useRef<HTMLInputElement>(null);

  const translations = getTranslations(messageFromUrl?.language ?? language);

  const hasMessage = !!messageFromUrl;
  const isDisabled = hasMessage;

  useEffect(() => {
    const shouldSetMessage =
      isEmpty(message) && !deepEqual(messageFromUrl, message) && !isResetting;

    if (hasMessage && shouldSetMessage) {
      dispatchMessageAction({
        type: MessageActionType.SetMessage,
        message: messageFromUrl,
      });
    }
  }, [isResetting, message, messageFromUrl]);

  useEffect(() => {
    const activeTheme = messageFromUrl?.themeName
      ? getTheme(messageFromUrl.themeName)
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
  }, [
    dispatchLanguageAction,
    dispatchThemeAction,
    messageFromUrl?.language,
    messageFromUrl?.themeName,
    preferredLanguage,
    theme,
  ]);

  const handleCopy = useCallback((): void => {
    if (tempInput.current) {
      encodeAndCopyMessage(message, tempInput.current);
    }
  }, [message]);

  const handleReset = useCallback((): void => {
    router.push("/");

    dispatchMessageAction({
      type: MessageActionType.ResetEverythingButTheme,
    });

    setIsResetting(true);
  }, [router]);

  const handleLanguageChange = useCallback(
    (newLanguage: LanguageEnum): void => {
      setForcedLanguage(newLanguage);
      return dispatchMessageAction({
        type: MessageActionType.SetMessage,
        message: {
          language: newLanguage,
        },
      });
    },
    [],
  );

  const handleSetMessage = useCallback(
    (newMessage: Partial<Message>): void =>
      dispatchMessageAction({
        type: MessageActionType.SetMessage,
        message: newMessage,
      }),
    [],
  );

  const handleSetCheck = useCallback(
    (checkValue: boolean, checkIndex: number) =>
      dispatchMessageAction({
        type: MessageActionType.SetCheck,
        check: checkValue,
        checkIndex,
      }),
    [],
  );

  const headData = useMemo(() => {
    const htmlHeadData = getDefaultHtmlHeadData(
      forcedLanguage ?? messageFromUrl?.language ?? language,
      `${deployUrl}${resolvedUrl}`,
      encodedMessage,
      deployUrl,
    );

    return renderHtmlHead(htmlHeadData);
  }, [
    deployUrl,
    encodedMessage,
    forcedLanguage,
    language,
    messageFromUrl?.language,
    resolvedUrl,
  ]);

  return (
    <>
      <Head>{headData}</Head>
      <div className={styles["theme-picker-button-wrapper"]}>
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

      <main className={styles["main"]}>
        <div className={styles["container"]}>
          <div className={styles["container-header"]}>
            <h1 className={styles["heading"]}>{translations.formHeading}</h1>
            <div className={styles["language-picker-container"]}>
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
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: Props }> {
  const encodedMessage = Array.isArray(context.query["m"])
    ? first(context.query["m"])
    : context.query["m"];
  const messageFromUrl = decodeMessage(encodedMessage ?? "");
  dotenv.config();

  const localUrl = "http://localhost:3000";
  const deployUrl = process.env["DEPLOY_URL"] ?? localUrl;

  const { host } = context.req.headers;
  const acceptLanguage = context.req.headers["accept-language"] ?? "";
  const acceptedLanguages = parser
    .parse(acceptLanguage)
    .map(language => language.code);
  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

  const serverSideProps: { props: Props } = {
    props: {
      encodedMessage: encodedMessage ?? null,
      messageFromUrl,
      resolvedUrl: context.resolvedUrl,
      deployUrl: host ? `//${host}` : deployUrl,
      preferredLanguage,
    },
  };

  return serverSideProps;
}

export default Home;
