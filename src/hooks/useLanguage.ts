import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

export const useLanguage = () => {
  return useContext(LanguageContext);
};
