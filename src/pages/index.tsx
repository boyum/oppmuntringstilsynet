import parser from "accept-language-parser";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { type FC, useReducer, useRef, useState } from "react";
import { Buttons } from "../components/Buttons/Buttons";
import { Footer } from "../components/Footer/Footer";
import { Form } from "../components/Form/Form";
import { LanguagePicker } from "../components/LanguagePicker/LanguagePicker";
import { ThemePicker } from "../components/ThemePicker/ThemePicker";
import { LanguageContext } from "../contexts/LanguageContext";
import { MessageContext } from "../contexts/MessageContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { Language } from "../enums/Language";
import {
  MessageAction,
  getEmptyState,
  messageReducer,
} from "../reducers/message.reducer";
import styles from "../styles/Home.module.scss";
import type { Message } from "../types/Message";
import { Theme } from "../types/Theme";
import { ThemeName } from "../types/ThemeName";
import { encodeAndCopyMessage } from "../utils/clipboard-utils";
import { renderHtmlHead } from "../utils/html-head-utils";
import { getFirstAcceptedLanguage, isLanguage } from "../utils/language-utils";
import { share, supportsShare } from "../utils/share-utils";
import {
  getFallbackTheme,
  getTheme,
  setPageThemeStyles,
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
  preferredLanguage: Language,
): Language => {
  return message?.language ?? preferredLanguage;
};

type Props = {
  encodedMessage: string | null;
  initialMessage: Message | null;
  resolvedUrl: string;
  deployUrl: string;
  preferredLanguage: Language;
  preferredTheme: Theme;
};

export const runtime = "experimental-edge";

const Home: FC<Props> = ({
  encodedMessage,
  initialMessage,
  resolvedUrl,
  deployUrl,
  preferredLanguage,
  preferredTheme,
}) => {
  const router = useRouter();

  const [language, setLanguage] = useState(() =>
    getInitialLanguage(initialMessage, preferredLanguage),
  );
  const [theme, setTheme] = useState(() =>
    getInitialTheme(initialMessage, preferredTheme),
  );

  const [themePickerIsOpen, setThemePickerIsOpen] = useState(false);
  const [languagePickerIsOpen, setLanguagePickerIsOpen] = useState(false);

  const [message, dispatchMessageAction] = useReducer(
    messageReducer,
    initialMessage ?? getEmptyState(),
  );

  const tempInput = useRef<HTMLInputElement>(null);
  const translations = getTranslations(language);

  const handleThemeChange = (newTheme: Theme): void => {
    setTheme(newTheme);
    setPageThemeStyles(newTheme);

    dispatchMessageAction({
      type: MessageAction.SetTheme,
      themeName: theme.name,
    });
  };

  const handleCopyOrShare = (): void => {
    if (tempInput.current) {
      if (supportsShare) {
        share(message);
      }

      encodeAndCopyMessage(message, tempInput.current);
    }
  };

  const handleReset = (): void => {
    router.push("/");

    dispatchMessageAction({
      type: MessageAction.ResetEverythingButTheme,
    });
  };

  const handleLanguageChange = (newLanguage: Language): void => {
    dispatchMessageAction({
      type: MessageAction.SetMessage,
      message: {
        language: newLanguage,
      },
    });
  };

  const headData = renderHtmlHead(
    language,
    `${deployUrl}${resolvedUrl}`,
    encodedMessage,
    deployUrl,
  );
  const disableForm = !!initialMessage;

  return (
    <MessageContext.Provider value={[message, dispatchMessageAction]}>
      <ThemeContext.Provider value={[theme, handleThemeChange]}>
        <LanguageContext.Provider value={[language, setLanguage]}>
          <Head>
            {headData}

            {/* By inserting a `body` element in `Head`, we can add properties to the body */}
            <body data-theme={theme.name} />
          </Head>

          <div className={styles["theme-language-picker-button-wrapper"]}>
            <ThemePicker
              isOpen={themePickerIsOpen}
              setIsOpen={open => {
                setThemePickerIsOpen(open);

                if (open) {
                  setLanguagePickerIsOpen(false);
                }
              }}
            />

            <LanguagePicker
              onChange={handleLanguageChange}
              isOpen={languagePickerIsOpen}
              setIsOpen={open => {
                setLanguagePickerIsOpen(open);

                if (open) {
                  setThemePickerIsOpen(false);
                }
              }}
            />
          </div>

          <main className={styles["main"]}>
            <div className={styles["container"]}>
              <div className={styles["container-header"]}>
                <h1 className={styles["heading"]}>
                  {translations.formHeading}
                </h1>
              </div>

              <Form isDisabled={disableForm} />

              <Buttons
                onReset={handleReset}
                onCopyOrShare={handleCopyOrShare}
              />
              <label className="hidden" aria-hidden="true">
                Hidden label used for copying
                <input ref={tempInput} type="text" readOnly tabIndex={-1} />
              </label>
            </div>
          </main>
          <Footer />
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </MessageContext.Provider>
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

  const { cookies, headers } = req;
  const { host: hostHeader, "accept-language": acceptLanguageHeader } = headers;

  const cookieLanguage = cookies?.["language"] as string | undefined;

  const acceptedLanguages = getAcceptedLanguages(acceptLanguageHeader ?? "");
  const preferredLanguage = isLanguage(cookieLanguage)
    ? cookieLanguage
    : getFirstAcceptedLanguage(acceptedLanguages);

  const cookieTheme = cookies?.["theme"] as ThemeName | undefined;
  const preferredTheme = cookieTheme
    ? getTheme(cookieTheme)
    : getFallbackTheme();

  return {
    props: {
      encodedMessage,
      initialMessage: decodedMessage,
      resolvedUrl,
      deployUrl: hostHeader ? `//${hostHeader}` : deployUrl,
      preferredLanguage,
      preferredTheme,
    },
  } satisfies { props: Props };
}

export default Home;
