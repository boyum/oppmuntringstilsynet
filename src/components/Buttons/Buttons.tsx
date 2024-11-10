import type { FC } from "react";
import { useTranslations } from "../../hooks/useTranslations";
import { supportsShare } from "../../utils/share-utils";
import { Button } from "../Button/Button";
import styles from "./Buttons.module.scss";

export type ButtonsProps = {
  onReset: () => void;
  onCopyOrShare: () => void;
};

export const Buttons: FC<ButtonsProps> = ({
  onCopyOrShare: handleCopyOrShare,
  onReset: handleReset,
}) => {
  const translations = useTranslations();

  return (
    <div className={styles["buttons"]} id="buttons">
      <Button
        id="copy-button"
        onClick={handleCopyOrShare}
        labelText={
          supportsShare
            ? translations.shareButtonText
            : translations.copyButtonText
        }
      />

      <Button
        id="reset-button"
        onClick={handleReset}
        labelText={translations.resetButtonText}
      />
    </div>
  );
};
