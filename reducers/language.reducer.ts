import LanguageEnum from '../enums/Language';

export type LanguageAction = {
  type:
  | 'setLanguage';
  payload: LanguageEnum;
}

export function languageReducer(state: LanguageEnum, action: LanguageAction): LanguageEnum {
  switch (action.type) {
    case 'setLanguage': {
      return action.payload;
    }
    default: throw new Error(`Invalid action type '${action.type}' in ${languageReducer.name}.`);
  }
}
