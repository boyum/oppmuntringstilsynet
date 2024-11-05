import { Dispatch, createContext } from "react";
import { LanguageEnum } from "../enums/Language";
import type { LanguageAction } from "../reducers/language.reducer";
import { defaultLanguage } from "../utils/language-utils";

const defaultState: [LanguageEnum, Dispatch<LanguageAction>] = [
  defaultLanguage,
  () => {
    /* Intentionally empty */
  },
];

export const LanguageContext = createContext(defaultState);
