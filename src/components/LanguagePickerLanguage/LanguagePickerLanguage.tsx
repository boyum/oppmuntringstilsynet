import { Language } from "../../enums/Language";
import { languages } from "../../models/languages";
import styles from "./LanguagePickerLanguage.module.scss";

type Props = {
  language: Language;
  isSelected: boolean;
  onClick: () => void;
};

export const LanguagePickerLanguage: React.FC<Props> = ({
  language,
  isSelected,
  onClick,
}) => {
  const classNames = [isSelected ? styles["is-selected"] : ""].join(" ");

  const languageCode = languages[language].codes[0];
  const languageName = languages[language].title;

  return (
    <li className={classNames}>
      <button
        id={`language-${languageCode}`}
        className={styles["button"]}
        type="button"
        onClick={onClick}
      >
        {languageName}
      </button>
    </li>
  );
};
