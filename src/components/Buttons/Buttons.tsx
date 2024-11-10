import type { FC } from "react";
import { useTranslations } from "../../hooks/useTranslations";
import { Button } from "../Button/Button";
import styles from "./Buttons.module.scss";

export type ButtonsProps = {
  onCopy: () => void;
  onReset: () => void;
  onShare: () => void;
  isIosOrAndroid: boolean;
};

export const Buttons: FC<ButtonsProps> = ({
  onCopy,
  onReset,
  onShare,
  isIosOrAndroid,
}) => {
  const translations = useTranslations();

  return (
    <div className={styles["buttons"]} id="buttons">
      {isIosOrAndroid ? (
        <Button
          id="share-button"
          onClick={onShare}
          labelText={translations.shareButtonText}
        />
      ) : (
        <Button
          id="copy-button"
          onClick={onCopy}
          labelText={translations.copyButtonText}
        />
      )}

      <Button
        id="reset-button"
        onClick={onReset}
        labelText={translations.resetButtonText}
      />
    </div>
  );
};
