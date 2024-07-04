import type { FC, MouseEventHandler } from "react";
import { Button } from "../Button/Button";
import styles from "./Buttons.module.scss";
import { useTranslations } from "../../hooks/useTranslations";

export type ButtonsProps = {
  handleReset: MouseEventHandler<HTMLButtonElement>;
  handleCopy: MouseEventHandler<HTMLButtonElement>;
};

export const Buttons: FC<ButtonsProps> = ({ handleCopy, handleReset }) => {
  const translations = useTranslations();

  return (
    <div className={styles["buttons"]} id="buttons">
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
