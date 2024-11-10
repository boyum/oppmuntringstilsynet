import { createContext } from "react";
import { Language } from "../enums/Language";
import { defaultLanguage } from "../utils/language-utils";

const defaultState: [Language, (language: Language) => void] = [
  defaultLanguage,
  // @ts-expect-error this is `null` at first,
  // then React updates it behind the scenes.
  null,
];

export const LanguageContext = createContext(defaultState);
