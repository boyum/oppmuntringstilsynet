import type { FC } from "react";
import type { Message } from "../../types/Message";
import styles from "./Checkboxes.module.scss";
import { useTranslations } from "../../hooks/useTranslations";
import type { Translations } from "../../types/Translations";

type Props = {
  isDisabled: boolean;
  message: Message;
  setCheck: (checkValue: boolean, checkIndex: number) => void;
};

export const Checkboxes: FC<Props> = ({ isDisabled, message, setCheck }) => {
  const translations = useTranslations();

  function handleCheckChange(payloadString: string, checkIndex: number): void {
    setCheck(payloadString === "false", checkIndex);
  }

  return message.checks.map((check, index) => {
    const id = `checkbox-${index}`;

    return (
      <div key={id}>
        <input
          id={id}
          className={`${styles["checkbox"]} hidden`}
          type="checkbox"
          checked={check}
          value={check.toString()}
          disabled={isDisabled}
          onChange={event =>
            handleCheckChange(event.currentTarget.value, index)
          }
        />
        <label className={styles["checkbox-label"]} htmlFor={id}>
          {getCheckboxLabel(translations, index)}
        </label>
      </div>
    );
  });
};

function getCheckboxLabel(translations: Translations, index: number): string {
  const labelKey = `checkbox${index + 1}Label` as keyof Translations;
  return translations[labelKey];
}
