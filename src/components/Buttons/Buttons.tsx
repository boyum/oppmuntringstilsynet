import { MouseEventHandler, useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { getTranslations } from "../../utils/translations-utils";
import { Button } from "../Button/Button";
import styles from "./Buttons.module.scss";

export type ButtonsProps = {
  handleReset: MouseEventHandler<HTMLButtonElement>;
  handleCopy: MouseEventHandler<HTMLButtonElement>;
};

export const Buttons: React.FC<ButtonsProps> = ({
  handleCopy,
  handleReset,
}) => {
  const [language] = useContext(LanguageContext);
  const translations = getTranslations(language);

  return (
    <div className={styles.buttons} id="buttons">
      <Button
        id="copy-button"
        onClick={handleCopy}
        labelText={translations.copyButtonText}
      />

      <Button
        id="reset-button"
        onClick={handleReset}
        labelText={translations.resetButtonText}
      />
    </div>
  );
};
