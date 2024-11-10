import { Language } from "../../enums/Language";
import { useLanguage } from "../../hooks/useLanguage";
import { languages } from "../../models/languages";
import { storeLanguageInCookie } from "../../utils/language-utils";
import { getTranslations } from "../../utils/translations-utils";
import { LanguagePickerLanguage } from "../LanguagePickerLanguage/LanguagePickerLanguage";
import styles from "./LanguagePicker.module.scss";

export type LanguagePickerProps = {
  onChange: (newLanguage: Language) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  onChange,
  isOpen,
  setIsOpen,
}) => {
  const [language, setLanguage] = useLanguage();

  const translations = getTranslations(language);

  const handleOnChange = (newLanguage: Language) => {
    onChange(newLanguage);
    setLanguage(newLanguage);
    setIsOpen(false);

    storeLanguageInCookie(newLanguage);
  };

  const className = isOpen
    ? `${styles["language-picker"]} ${styles["language-picker-open"]}`
    : styles["language-picker"];

  return (
    <div>
      <button
        id="language-picker-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles["language-picker-button"]}
      >
        <span className="hidden">
          {isOpen
            ? translations.closeLanguagePicker
            : translations.openLanguagePicker}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </button>
      <div id="language-picker" data-is-open={isOpen} className={className}>
        <h2 className={styles["heading"]}>
          {translations.languagePickerHeading}
        </h2>
        <ol hidden={!isOpen} className={styles["list"]}>
          {Object.keys(languages).map(l => (
            <LanguagePickerLanguage
              isSelected={language === l}
              onClick={() => handleOnChange(l as Language)}
              key={l}
              language={l as Language}
            />
          ))}
        </ol>
      </div>
    </div>
  );
};
