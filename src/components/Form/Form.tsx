import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { Message } from "../../types/Message";
import { Translations } from "../../types/Translations";
import { getTranslations } from "../../utils/translations-utils";
import styles from "./Form.module.scss";

export type FormProps = {
  isDisabled: boolean;
  message: Message;
  setMessage: (message: Partial<Message>) => void;
  setCheck: (checkValue: boolean, checkIndex: number) => void;
};

export const Form: React.FC<FormProps> = ({
  isDisabled,
  message,
  setMessage,
  setCheck,
}) => {
  const [language] = useContext(LanguageContext);
  const translations = getTranslations(language);

  function handleChange(newMessage: Partial<Message>): void {
    setMessage(newMessage);
  }

  function handleCheckChange(payloadString: string, checkIndex: number): void {
    const checkValue = payloadString === "false";

    setCheck(checkValue, checkIndex);
  }

  function getCheckboxLabel(index: number): string {
    const labelKey = `checkbox${index + 1}Label` as keyof Translations;
    return translations[labelKey];
  }

  function getCheckboxId(index: number): string {
    return `checkbox-${index}`;
  }

  function renderCheckboxes(): JSX.Element[] {
    const checkboxClassName = `${styles.checkbox} hidden`;

    return message.checks.map((check, index) => (
      <div key={getCheckboxId(index)}>
        <input
          id={getCheckboxId(index)}
          className={checkboxClassName}
          type="checkbox"
          checked={check}
          value={check.toString()}
          disabled={isDisabled}
          onChange={event =>
            handleCheckChange(event.currentTarget.value, index)
          }
        />
        <label className={styles.checkboxLabel} htmlFor={getCheckboxId(index)}>
          {getCheckboxLabel(index)}
        </label>
      </div>
    ));
  }

  return (
    <form className={styles.form}>
      <label className={styles.date}>
        {translations.dateLabel}
        <input
          type="text"
          id="date-field"
          value={message.date}
          disabled={isDisabled}
          onChange={event => handleChange({ date: event.currentTarget.value })}
        />
      </label>
      <label className={styles.message}>
        {translations.messageLabel}
        <textarea
          id="message-body-field"
          rows={4}
          value={message.message}
          disabled={isDisabled}
          onChange={event =>
            handleChange({ message: event.currentTarget.value })
          }
        />
      </label>
      <div className={styles.checkboxContainer}>
        {translations.checkboxHeading}
        {renderCheckboxes()}
      </div>
      <label className={styles.name}>
        {translations.nameLabel}
        <input
          id="name-field"
          type="text"
          value={message.name}
          disabled={isDisabled}
          onChange={event => handleChange({ name: event.currentTarget.value })}
        />
      </label>
    </form>
  );
};
