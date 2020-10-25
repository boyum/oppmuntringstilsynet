import { Dispatch } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import MessageContext from '../contexts/MessageContext';
import LanguageEnum from '../enums/Language';
import { LanguageAction } from '../reducers/language.reducer';
import { getEmptyState, MessageAction } from '../reducers/message.reducer';
import Message from '../types/Message';

export const messageProviderValue =
  (message: Message = getEmptyState()): [Message, Dispatch<MessageAction>] => [message, undefined];

export const languageProviderValue =
  (language: LanguageEnum = LanguageEnum.NorskBokmal): [LanguageEnum, Dispatch<LanguageAction>] => [language, undefined];

export function LanguageContextWrapper({ children }): JSX.Element {
  return <LanguageContext.Provider value={languageProviderValue()}>{children}</LanguageContext.Provider>
}

export function MessageContextWrapper({ children }): JSX.Element {
  return <MessageContext.Provider value={messageProviderValue()}>{children}</MessageContext.Provider>
}
