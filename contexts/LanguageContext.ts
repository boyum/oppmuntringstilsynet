import { createContext } from 'preact';
import LanguageEnum from '../enums/Language';
import { LanguageAction } from '../reducers/language.reducer';

const defaultLanguage = LanguageEnum.NorskBokmal;

const defaultState: [LanguageEnum, (action: LanguageAction) => void] = [defaultLanguage, undefined];

export default createContext(defaultState);
