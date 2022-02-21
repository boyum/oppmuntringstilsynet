import { ChangeEventHandler, useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { LanguageEnum } from "../../enums/Language";
import { Language } from "../../models/Language";
import { languages } from "../../models/languages";
import { LanguageActionType } from "../../reducers/language.reducer";
import { getTranslations } from "../../utils/translations-utils";
import styles from "./LanguagePicker.module.scss";

export type LanguagePickerProps = {
  handleChange: (newLanguage: LanguageEnum) => void;
};

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  handleChange,
}) => {
  const [language, setLanguage] = useContext(LanguageContext);
  const languageArr = Object.entries(languages).map(
    ([languageName, lang]: [string, Language]) => [languageName, lang.title],
  );

  const translations = getTranslations(language);

  const handleOnChange: ChangeEventHandler<HTMLSelectElement> = ({
    currentTarget,
  }) => {
    const newLanguage = LanguageEnum[currentTarget.value as LanguageEnum];
    handleChange(newLanguage);

    setLanguage({
      type: LanguageActionType.SetLanguage,
      language: newLanguage,
    });
  };

  return (
    <label>
      <span className="hidden">{translations.setLanguage}</span>
      <select
        data-test-id="language-select"
        className={styles.select}
        onChange={handleOnChange}
        value={language}
      >
        {languageArr.map(([languageName, languageTitle]) => (
          <option
            key={languageName}
            className={styles.option}
            value={languageName}
          >
            {languageTitle}
          </option>
        ))}
      </select>
    </label>
  );
};
