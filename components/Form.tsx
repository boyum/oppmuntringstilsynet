import { useContext, useEffect, useReducer } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import Message from '../types/Message';
import Translations from '../types/Translations';

type Action = {
  type:
  | 'setValue'
  | 'setCheck'
  | 'reset';
  payload?: any;
  checksIndex?: number;
}

function getEmptyState(s): Message {
  console.log('s', s);
  return {
    checks: [false, false, false],
    date: '',
    message: '',
    name: ''
  }
}

function reducer(state: Message, action: Action) {
  switch (action.type) {
    case 'setValue': return { ...state, ...action.payload };
    case 'setCheck': return {
      ...state,
      checks: state.checks.map((check, index) => index === action.checksIndex ? action.payload : check)
    }
    case 'reset': return getEmptyState(undefined);
    default: throw new Error(`Invalid action type '${action.type}' in form reducer.`);
  }
}

function Form(props: { message: Message, setMessage, handleCopy: (event) => void }): JSX.Element {
  const [message, dispatch] = useReducer<(state: Message, action: Action) => Message, Message>(reducer, props.message, getEmptyState);
  const translations = useContext<Translations>(LanguageContext);
  useEffect(() => props.setMessage(message));

  function handleChange(payload: { [key: string]: string }): void {
    dispatch({ type: 'setValue', payload });
  }

  function handleCheckChange(payloadString: string, index: number): void {
    const payload = payloadString === 'true';

    dispatch({ type: 'setCheck', payload, checksIndex: index });
  }

  function handleReset(): void {
    dispatch({ type: 'reset' });
  }

  function getCheckboxLabel(index: number): string {
    return translations[`checkbox${index + 1}Label`];
  }

  function getCheckboxId(index: number): string {
    return `checkbox-${index}`;
  }

  return (
    <>
      <form className="form">
        <label className="date">
          {translations.dateLabel}
          <input type="text" value={message.date} onChange={(event) => handleChange({ date: event.currentTarget.value })} />
        </label>
        <label className="message">
          {translations.messageLabel}
          <textarea value={message.message} onChange={(event) => handleChange({ message: event.currentTarget.value })}></textarea>
        </label>
        <div className="checkbox-container">
          {message.checks.map((check, index) => (
            <div key={getCheckboxId(index)}>
              <input id={getCheckboxId(index)} type="checkbox" value={check.toString()} onChange={(event) => handleCheckChange(event.currentTarget.value, index)} />
              <label htmlFor={getCheckboxId(index)}>
                {getCheckboxLabel(index)}
              </label>
            </div>
          ))}
        </div>
        <label className="name">
          {translations.nameLabel}
          <input type="text" value={message.name} onChange={(event) => handleChange({ name: event.currentTarget.value })} />
        </label>
      </form>

      <div className="buttons">
        <button className="copy-link" onClick={props.handleCopy}>{translations.copyButtonText}</button>
        <button className="reset" onClick={handleReset}>{translations.resetButtonText}</button>
      </div>
    </>
  );
}

export default Form;