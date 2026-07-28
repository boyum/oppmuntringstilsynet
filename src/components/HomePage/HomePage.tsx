"use client";

import { useRouter } from "next/navigation";
import { type FC, useEffect, useReducer, useRef, useState } from "react";
import { Buttons } from "../Buttons/Buttons";
import { Footer } from "../Footer/Footer";
import { Form } from "../Form/Form";
import { LanguagePicker } from "../LanguagePicker/LanguagePicker";
import { ThemePicker } from "../ThemePicker/ThemePicker";
import { LanguageContext } from "../../contexts/LanguageContext";
import { MessageContext } from "../../contexts/MessageContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import type { Language } from "../../enums/Language";
import {
  getEmptyState,
  MessageAction,
  messageReducer,
} from "../../reducers/message.reducer";
import styles from "../../styles/Home.module.scss";
import type { Message } from "../../types/Message";
import type { Theme } from "../../types/Theme";
import { encodeAndCopyMessage } from "../../utils/clipboard-utils";
import { getDefaultHtmlHeadData } from "../../utils/html-head-utils";
import { LATEST_QUERY_PARAM_MESSAGE_KEY } from "../../utils/url-utils";
import { getTheme, setPageThemeStyles } from "../../utils/theme-utils";
import { getTranslations } from "../../utils/translations-utils";
import { share } from "../../utils/share-utils";

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

export type HomePageProps = {
  encodedMessage: string | null;
  initialMessage: Message | null;
  resolvedUrl: string;
  deployUrl: string;
  preferredLanguage: Language;
  preferredTheme: Theme;
  isIosOrAndroid: boolean;
};

function setMetaTag(
  selector: string,
  attributes: Record<string, string>,
  content: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
    document.head.append(element);
  }

  element.setAttribute("content", content);
}

function syncHead(
  language: Language,
  resolvedUrl: string,
  encodedMessage: string | null,
  deployUrl: string,
): void {
  const { title, description, ogTitle, ogDescription } =
    getDefaultHtmlHeadData(language);

  document.title = title;

  const ogUrl = `${deployUrl}${resolvedUrl}`;
  const ogImageUrl = `${deployUrl}/api/og-image${
    encodedMessage ? `?${LATEST_QUERY_PARAM_MESSAGE_KEY}=${encodedMessage}` : ""
  }`;

  setMetaTag('meta[name="description"]', { name: "description" }, description);
  setMetaTag('meta[property="og:title"]', { property: "og:title" }, ogTitle);
  setMetaTag(
    'meta[property="og:description"]',
    { property: "og:description" },
    ogDescription,
  );
  setMetaTag('meta[property="og:url"]', { property: "og:url" }, ogUrl);
  setMetaTag(
    'meta[property="og:image"]',
    { property: "og:image" },
    ogImageUrl,
  );
  setMetaTag(
    'meta[property="og:image:width"]',
    { property: "og:image:width" },
    "1200",
  );
  setMetaTag(
    'meta[property="og:image:height"]',
    { property: "og:image:height" },
    "627",
  );
  setMetaTag(
    'meta[property="og:image:alt"]',
    { property: "og:image:alt" },
    ogTitle,
  );
  setMetaTag('meta[property="og:type"]', { property: "og:type" }, "website");
}

const HomePage: FC<HomePageProps> = ({
  encodedMessage,
  initialMessage,
  resolvedUrl,
  deployUrl,
  preferredLanguage,
  preferredTheme,
  isIosOrAndroid,
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

  useEffect(() => {
    syncHead(language, resolvedUrl, encodedMessage, deployUrl);
  }, [language, resolvedUrl, encodedMessage, deployUrl]);

  useEffect(() => {
    setPageThemeStyles(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme): void => {
    setTheme(newTheme);

    dispatchMessageAction({
      type: MessageAction.SetTheme,
      themeName: newTheme.name,
    });
  };

  const handleCopy = (): void => {
    if (tempInput.current) {
      encodeAndCopyMessage(message, tempInput.current);
    }
  };

  const handleShare = (): void => {
    if (isIosOrAndroid) {
      share(message);
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

  const disableForm = !!initialMessage;

  return (
    <MessageContext.Provider value={[message, dispatchMessageAction]}>
      <ThemeContext.Provider value={[theme, handleThemeChange]}>
        <LanguageContext.Provider value={[language, setLanguage]}>
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
                <h1 className={styles["heading"]}>{translations.formHeading}</h1>
              </div>

              <Form isDisabled={disableForm} />

              <Buttons
                onReset={handleReset}
                onCopy={handleCopy}
                onShare={handleShare}
                isIosOrAndroid={isIosOrAndroid}
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

export default HomePage;