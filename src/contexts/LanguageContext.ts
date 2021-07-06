import { createContext, Dispatch } from "react";
import LanguageEnum from "../enums/Language";
import { LanguageAction } from "../reducers/language.reducer";

const defaultLanguage = LanguageEnum.NorskBokmal;

const defaultState: [LanguageEnum, Dispatch<LanguageAction>] = [
  defaultLanguage,
  () => {
    /* Intentionally empty */
  },
];

export default createContext(defaultState);
