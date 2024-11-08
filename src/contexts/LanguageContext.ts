import { createContext } from "react";
import { LanguageEnum } from "../enums/Language";
import { defaultLanguage } from "../utils/language-utils";

const defaultState: [LanguageEnum, (language: LanguageEnum) => void] = [
  defaultLanguage,
  () => {
    /* Intentionally empty */
  },
];

export const LanguageContext = createContext(defaultState);
