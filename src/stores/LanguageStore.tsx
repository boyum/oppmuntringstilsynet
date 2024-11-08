import { type ReactNode, useState } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { LanguageEnum } from "../enums/Language";

export type LanguageStoreProps = {
  children: ReactNode;
};

export const LanguageStore: React.FC<LanguageStoreProps> = ({ children }) => {
  const [language, setLanguage] = useState(LanguageEnum.English);

  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      {children}
    </LanguageContext.Provider>
  );
};
