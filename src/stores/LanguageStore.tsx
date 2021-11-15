import { useReducer } from "react";
import LanguageContext from "../contexts/LanguageContext";
import LanguageEnum from "../enums/Language";
import { languageReducer } from "../reducers/language.reducer";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const LanguageStore = ({ children }: Props): JSX.Element => {
  const [language, dispatch] = useReducer(
    languageReducer,
    LanguageEnum.English,
  );

  return (
    <LanguageContext.Provider value={[language, dispatch]}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageStore;
