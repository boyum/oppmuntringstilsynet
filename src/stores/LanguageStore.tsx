import { useReducer } from "react";
import LanguageContext from "../contexts/LanguageContext";
import LanguageEnum from "../enums/Language";
import { languageReducer } from "../reducers/language.reducer";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const LanguageStore: React.FC<Props> = ({ children }) => {
  const langReducer = useReducer(languageReducer, LanguageEnum.English);

  return (
    <LanguageContext.Provider value={langReducer}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageStore;
