import parser from "accept-language-parser";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Buttons } from "../components/Buttons/Buttons";
import { Footer } from "../components/Footer/Footer";
import { Form } from "../components/Form/Form";
import { LanguagePicker } from "../components/LanguagePicker/LanguagePicker";
import { ThemePicker } from "../components/ThemePicker/ThemePicker";
import { LanguageContext } from "../contexts/LanguageContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { LanguageEnum } from "../enums/Language";
import { useMessage } from "../hooks/useMessage";
import { MessageActionType } from "../reducers/message.reducer";
import styles from "../styles/Home.module.scss";
import type { Message } from "../types/Message";
import { Theme } from "../types/Theme";
import { ThemeName } from "../types/ThemeName";
import { encodeAndCopyMessage } from "../utils/clipboard-utils";
import {
  getDefaultHtmlHeadData,
  renderHtmlHead,
} from "../utils/html-head-utils";
import { getPreferredLanguage } from "../utils/language-utils";
import {
  getFallbackTheme,
  getTheme,
  setPageThemeStyles,
  storeThemeInCookie,
} from "../utils/theme-utils";
import { getTranslations } from "../utils/translations-utils";
import { getEncodedAndDecodedMessage } from "../utils/url-utils";

const getInitialTheme = (
  message: Message | null,
  preferredTheme: Theme,
): Theme => {
  if (message?.themeName) {
    return getTheme(message.themeName);
  }

  return preferredTheme;
};

const getInitialLanguage = (
  message: Message | null,
  preferredLanguage: LanguageEnum,
): LanguageEnum => {
  return message?.language ?? preferredLanguage;
};

type Props = {
  encodedMessage: string | null;
  messageFromUrl: Message | null;
  resolvedUrl: string;
  deployUrl: string;
  preferredLanguage: LanguageEnum;
  preferredTheme: Theme;
};

const Home: FC<Props> = ({
  encodedMessage,
  messageFromUrl,
  resolvedUrl,
  deployUrl,
  preferredLanguage,
  preferredTheme,
}) => {
  const router = useRouter();

  const [language, setLanguage] = useState(() =>
    getInitialLanguage(messageFromUrl, preferredLanguage),
  );
  const [theme, setTheme] = useState(() =>
    getInitialTheme(messageFromUrl, preferredTheme),
  );

  const [message, dispatchMessageAction] = useMessage();

  const tempInput = useRef<HTMLInputElement>(null);
  const translations = getTranslations(language);

  if (messageFromUrl) {
    dispatchMessageAction({
      type: MessageActionType.SetMessage,
      message: messageFromUrl,
    });
  }

  const hasMessage = !!messageFromUrl;
  const isDisabled = hasMessage;

  const handleThemeChange = (newTheme: Theme): void => {
    setTheme(newTheme);

    setPageThemeStyles(newTheme);
    storeThemeInCookie(newTheme.name);

    dispatchMessageAction({
      type: MessageActionType.SetTheme,
      themeName: theme.name,
    });
  };

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
  }, [router]);

  const handleLanguageChange = (newLanguage: LanguageEnum): void => {
    dispatchMessageAction({
      type: MessageActionType.SetMessage,
      message: {
        language: newLanguage,
      },
    });
  };

  const headData = useMemo(() => {
    const htmlHeadData = getDefaultHtmlHeadData(
      language,
      `${deployUrl}${resolvedUrl}`,
      encodedMessage,
      deployUrl,
    );

    return renderHtmlHead(htmlHeadData);
  }, [deployUrl, encodedMessage, language, resolvedUrl]);

  return (
    <ThemeContext.Provider value={[theme, handleThemeChange]}>
      <LanguageContext.Provider value={[language, setLanguage]}>
        <Head>{headData}</Head>
        <div className={styles["theme-picker-button-wrapper"]}>
          <ThemePicker />
        </div>

        <main className={styles["main"]}>
          <div className={styles["container"]}>
            <div className={styles["container-header"]}>
              <h1 className={styles["heading"]}>{translations.formHeading}</h1>
              <div className={styles["language-picker-container"]}>
                <LanguagePicker onChange={handleLanguageChange} />
              </div>
            </div>

            <Form isDisabled={isDisabled} />

            <Buttons handleReset={handleReset} handleCopy={handleCopy} />
            <label className="hidden" aria-hidden="true">
              Hidden label used for copying
              <input ref={tempInput} type="text" readOnly tabIndex={-1} />
            </label>
          </div>
        </main>
        <Footer />
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

const localUrl = "http://localhost:3000";
const deployUrl = process.env["DEPLOY_URL"] ?? localUrl;

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: Props }> {
  const { req, resolvedUrl } = context;

  const queryParams = getQueryParams(resolvedUrl);
  const [encodedMessage, decodedMessage] =
    getEncodedAndDecodedMessage(queryParams);

  const { host: hostHeader, "accept-language": acceptLanguageHeader } =
    req.headers;

  const acceptedLanguages = getAcceptedLanguages(acceptLanguageHeader ?? "");
  const preferredLanguage = getPreferredLanguage(acceptedLanguages);

  const cookieTheme = req.cookies["theme"] as ThemeName | undefined;
  const preferredTheme = cookieTheme
    ? getTheme(cookieTheme)
    : getFallbackTheme();

  return {
    props: {
      encodedMessage,
      messageFromUrl: decodedMessage,
      resolvedUrl,
      deployUrl: hostHeader ? `//${hostHeader}` : deployUrl,
      preferredLanguage,
      preferredTheme,
    },
  } satisfies { props: Props };
}

export default Home;
