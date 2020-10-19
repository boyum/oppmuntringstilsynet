import { useContext, useState } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import MessageContext from '../contexts/MessageContext';
import { getTranslations } from '../pages/api/translations';
import { SetChecksPayload, SetValuePayload } from '../reducers/message.reducer';
import styles from '../styles/Form.module.css';

export default function Form({ isDisabled }: { isDisabled: boolean }): JSX.Element {
  const [message, dispatch] = useContext(MessageContext);
  const [language, _] = useContext(LanguageContext);
  const translations = getTranslations(language);

  function handleChange(payload: SetValuePayload): void {
    dispatch({ type: 'setValue', payload });
  }

  function handleCheckChange(payloadString: string, index: number): void {
    const payload: SetChecksPayload = { check: payloadString === 'false' };

    dispatch({ type: 'setCheck', payload, checksIndex: index });
  }

  function getCheckboxLabel(index: number): string {
    return translations[`checkbox${index + 1}Label`];
  }

  function getCheckboxId(index: number): string {
    return `checkbox-${index}`;
  }

  function renderCheckboxes(): JSX.Element[] {

    return message.checks.map((check, index) => (
      <div key={getCheckboxId(index)}>
        <input
          id={getCheckboxId(index)}
          className={styles.checkbox}
          type="checkbox"
          checked={check}
          value={check.toString()}
          disabled={isDisabled}
          onChange={(event) => handleCheckChange(event.currentTarget.value, index)} />
        <label className={styles.checkboxLabel} htmlFor={getCheckboxId(index)}>
          {getCheckboxLabel(index)}
        </label>
      </div>
    ));
  }

  return (
    <>
      <form className={styles.form}>
        <label className={styles.date}>
          {translations.dateLabel}
          <input
            type="text"
            value={message.date}
            disabled={isDisabled}
            onChange={(event) => handleChange({ date: event.currentTarget.value })} />
        </label>
        <label className={styles.message}>
          {translations.messageLabel}
          <textarea
            rows={4}
            value={message.message}
            disabled={isDisabled}
            onChange={(event) => handleChange({ message: event.currentTarget.value })}></textarea>
        </label>
        <div className={styles.checkboxContainer}>
          {translations.checkboxHeading}
          {renderCheckboxes()}
        </div>
        <label className={styles.name}>
          {translations.nameLabel}
          <input
            type="text"
            value={message.name}
            disabled={isDisabled}
            onChange={(event) => handleChange({ name: event.currentTarget.value })} />
        </label>
      </form>
    </>
  );
}
