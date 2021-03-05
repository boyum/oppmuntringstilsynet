import React, { Dispatch } from "react";
import LanguageEnum from "../enums/Language";
import { LanguageAction } from "../reducers/language.reducer";

const defaultLanguage = LanguageEnum.NorskBokmal;

const defaultState: [LanguageEnum, Dispatch<LanguageAction>] = [
  defaultLanguage,
  undefined,
];

export default React.createContext(defaultState);
