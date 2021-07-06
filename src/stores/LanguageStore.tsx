import { useReducer } from "react";
import LanguageContext from "../contexts/LanguageContext";
import { languageReducer } from "../reducers/language.reducer";
import LanguageEnum from "../enums/Language";

function LanguageStore({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  const [language, dispatch] = useReducer(
    languageReducer,
    LanguageEnum.NorskBokmal,
  );

  return (
    <LanguageContext.Provider value={[language, dispatch]}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageStore;
