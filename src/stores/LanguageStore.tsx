import { useReducer, type JSX } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { LanguageEnum } from "../enums/Language";
import { languageReducer } from "../reducers/language.reducer";

export type LanguageStoreProps = {
  children: JSX.Element | JSX.Element[];
};

export const LanguageStore: React.FC<LanguageStoreProps> = ({ children }) => {
  const langReducer = useReducer(languageReducer, LanguageEnum.English);

  return (
    <LanguageContext.Provider value={langReducer}>
      {children}
    </LanguageContext.Provider>
  );
};
