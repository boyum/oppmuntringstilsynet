import type { FC } from "react";
import { useMessage } from "../../hooks/useMessage";
import { useTranslations } from "../../hooks/useTranslations";
import { MessageAction } from "../../reducers/message.reducer";
import type { Message } from "../../types/Message";
import { Checkboxes } from "../Checkboxes/Checkboxes";
import { CheckboxesContainer } from "../CheckboxesContainer/CheckboxesContainer";
import styles from "./Form.module.scss";

export type FormProps = {
  isDisabled: boolean;
};

export const Form: FC<FormProps> = ({ isDisabled }) => {
  const translations = useTranslations();
  const [message, dispatchMessageAction] = useMessage();

  const setMessage = (newMessage: Partial<Message>): void =>
    dispatchMessageAction({
      type: MessageAction.SetMessage,
      message: newMessage,
    });

  const setCheck = (checkValue: boolean, checkIndex: number) =>
    dispatchMessageAction({
      type: MessageAction.SetCheck,
      check: checkValue,
      checkIndex,
    });

  return (
    <form className={styles["form"]}>
      <label className={styles["date"]} htmlFor="date-field">
        {translations.dateLabel}
        <input
          type="text"
          id="date-field"
          value={message.date}
          disabled={isDisabled}
          onChange={event => setMessage({ date: event.currentTarget.value })}
        />
      </label>

      <label className={styles["message"]} htmlFor="message-body-field">
        {translations.messageLabel}
        <textarea
          id="message-body-field"
          rows={4}
          value={message.message}
          disabled={isDisabled}
          onChange={event => setMessage({ message: event.currentTarget.value })}
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
          onChange={event => setMessage({ name: event.currentTarget.value })}
        />
      </label>
    </form>
  );
};
