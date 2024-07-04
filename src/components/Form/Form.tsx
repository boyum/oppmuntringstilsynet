import type { FC } from "react";
import { useTranslations } from "../../hooks/useTranslations";
import type { Message } from "../../types/Message";
import { Checkboxes } from "../Checkboxes/Checkboxes";
import { CheckboxesContainer } from "../CheckboxesContainer/CheckboxesContainer";
import styles from "./Form.module.scss";

export type FormProps = {
  isDisabled: boolean;
  message: Message;
  setMessage: (message: Partial<Message>) => void;
  setCheck: (checkValue: boolean, checkIndex: number) => void;
};

export const Form: FC<FormProps> = ({
  isDisabled,
  message,
  setMessage,
  setCheck,
}) => {
  const translations = useTranslations();

  function handleChange(newMessage: Partial<Message>): void {
    setMessage(newMessage);
  }

  return (
    <form className={styles["form"]}>
      <label className={styles["date"]} htmlFor="date-field">
        {translations.dateLabel}
        <input
          type="text"
          id="date-field"
          value={message.date}
          disabled={isDisabled}
          onChange={event => handleChange({ date: event.currentTarget.value })}
        />
      </label>
      <label className={styles["message"]} htmlFor="message-body-field">
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
      <CheckboxesContainer>
        <Checkboxes
          isDisabled={isDisabled}
          message={message}
          setCheck={setCheck}
        />
      </CheckboxesContainer>
      <label className={styles["name"]} htmlFor="name-field">
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
