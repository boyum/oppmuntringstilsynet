"use client";

import { useRouter } from "next/navigation";
import { type FC, useEffect, useReducer, useRef, useState } from "react";
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
  getEmptyState,
  MessageAction,
  messageReducer,
} from "../reducers/message.reducer";
import styles from "../styles/Home.module.scss";
import type { Message } from "../types/Message";
import { Theme } from "../types/Theme";
import { encodeAndCopyMessage } from "../utils/clipboard-utils";
import type { HomeServerProps } from "../utils/server-props";
import { share } from "../utils/share-utils";
import { getTheme, setPageThemeStyles } from "../utils/theme-utils";
import { getTranslations } from "../utils/translations-utils";

export type HomeProps = Pick<
  HomeServerProps,
  "initialMessage" | "preferredLanguage" | "preferredTheme" | "isIosOrAndroid"
>;

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

export const Home: FC<HomeProps> = ({
  initialMessage,
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
    setPageThemeStyles(theme);
  }, [theme]);

  useEffect(() => {
    document.title = translations.pageTitle;
  }, [language, translations.pageTitle]);

  const handleThemeChange = (newTheme: Theme): void => {
    setTheme(newTheme);

    dispatchMessageAction({
      type: MessageAction.SetTheme,
      themeName: theme.name,
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
                <h1 className={styles["heading"]}>
                  {translations.formHeading}
                </h1>
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
