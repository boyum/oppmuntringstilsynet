import { useContext, useReducer } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import { getTranslation } from '../pages/api/translations';
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

function getEmptyState(): Message {
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
    case 'reset': return getEmptyState();
    default: throw new Error(`Invalid action type '${action.type}' in form reducer.`);
  }
}

function Form(props: { message: Message, handleCopy: Function }): JSX.Element {
  const [state, dispatch] = useReducer<(state: Message, action: Action) => Message, Message>(reducer, props.message, getEmptyState);
  const translations = useContext<Translations>(LanguageContext);

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

  return (
    <>
      <form className="form">
        <label className="date">
          {translations.dateLabel}
          <input type="text" value={state.date} onInput={(event) => handleChange({ date: event.currentTarget.value })} />
        </label>
        <label className="message">
          {translations.messageLabel}
          <textarea value={state.message} onInput={(event) => handleChange({ date: event.currentTarget.value })}></textarea>
        </label>
        <div className="checkbox-container">
          {state.checks.map((check, index) => (
            <>
              <input id={`checkbox-${index}`} type="checkbox" value={check.toString()} onInput={(event) => handleCheckChange(event.currentTarget.value, index)} />
              <label htmlFor={`checkbox-${index}`}>
                {getCheckboxLabel(index)}
              </label>
            </>
          ))}
        </div>
        <label className="name">
          {translations.nameLabel}
          <input type="text" value={state.date} onInput={(event) => handleChange({ name: event.currentTarget.value })} />
        </label>
      </form>

      <div className="buttons">
        <button className="copy-link" onClick={handleCopy}>{translations.copyButtonText}</button>
        <button className="reset" onClick={handleReset}>{translations.resetButtonText}</button>
      </div>
    </>
  );
}
// class Form extends React.Component {
//   state: Message;

//   constructor(props) {
//     super(props);

//     this.state = this.emptyState;

//     this.handleCheck1Change = this.handleCheck1Change.bind(this);
//     this.handleCheck2Change = this.handleCheck2Change.bind(this);
//     this.handleCheck3Change = this.handleCheck3Change.bind(this);
//     this.handleDateChange = this.handleDateChange.bind(this);
//     this.handleMessageChange = this.handleMessageChange.bind(this);
//     this.handleNameChange = this.handleNameChange.bind(this);
//     this.handleReset = this.handleReset.bind(this);
//   }

//   handleCheck1Change(event: InputEvent) {
//     const input = event.currentTarget as HTMLInputElement;
//     const value = input.value;

//     this.setState({
//       this.state,
//     })
//   }

//   handleCheck2Change(event: InputEvent) {

//   }

//   handleCheck3Change(event: InputEvent) {

//   }

//   handleDateChange(event: InputEvent) {

//   }

//   handleMessageChange(event: InputEvent) {

//   }

//   handleNameChange(event: InputEvent) {

//   }

//   handleReset() {
//     this.setState(this.emptyState)
//   }

//   get emptyState(): Message {
//     return {
//       check1: false,
//       check2: false,
//       check3: false,
//       date: '',
//       message: '',
//       name: ''
//     }
//   }
// }

export default Form;