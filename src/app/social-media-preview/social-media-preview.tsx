"use client";

import { type FC, useEffect, useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import type { Language } from "../../enums/Language";
import type { Message } from "../../types/Message";
import { getShareTitle } from "../../utils/share-utils";
import {
  getFallbackTheme,
  getTheme,
  setPageThemeStyles,
  storeThemeInCookie,
} from "../../utils/theme-utils";
import { getTranslations } from "../../utils/translations-utils";
import styles from "./SocialMediaPreview.module.scss";

export type SocialMediaPreviewProps = {
  message: Message | null;
  preferredLanguage: Language;
};

const SocialMediaPreview: FC<SocialMediaPreviewProps> = ({
  message,
  preferredLanguage,
}) => {
  const [language, setLanguage] = useState(
    message?.language ?? preferredLanguage,
  );
  const [theme, setTheme] = useState(
    message?.themeName ? getTheme(message.themeName) : getFallbackTheme(),
  );

  const translations = getTranslations(
    message?.language ?? preferredLanguage ?? language,
  );

  const title = message
    ? getShareTitle(message)
    : translations.previewTitleWithoutMessage;

  useEffect(() => {
    const activeTheme = message?.themeName
      ? getTheme(message.themeName)
      : theme;

    if (message?.themeName) {
      storeThemeInCookie(message.themeName);
    }

    setPageThemeStyles(activeTheme);
    setTheme(activeTheme);
  }, [message, setTheme, theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <LanguageContext.Provider value={[language, setLanguage]}>
        <main className={styles["main"]}>
          <div className={styles["preview-container"]}>
            <h1 className={styles["heading"]}>{title}</h1>
          </div>
        </main>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

export default SocialMediaPreview;
