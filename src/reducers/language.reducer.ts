import type { LanguageEnum } from "../enums/Language";

export enum LanguageActionType {
  SetLanguage = "setLanguage",
  NoOp = "noOp",
}

export type LanguageAction = {
  type: LanguageActionType.SetLanguage;
  language: LanguageEnum;
};

export function languageReducer(
  _state: LanguageEnum,
  action: LanguageAction,
): LanguageEnum {
  switch (action.type) {
    case LanguageActionType.SetLanguage:
      return action.language;
  }
}
