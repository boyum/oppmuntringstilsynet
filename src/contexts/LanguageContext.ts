import { createContext, Dispatch } from "react";
import { LanguageEnum } from "../enums/Language";
import type { LanguageAction } from "../reducers/language.reducer";

export const defaultLanguage = LanguageEnum.NorskBokmal;

const defaultState: [LanguageEnum, Dispatch<LanguageAction>] = [
  defaultLanguage,
  () => {
    /* Intentionally empty */
  },
];

export const LanguageContext = createContext(defaultState);
