import LanguageEnum from "../enums/Language";

export enum LanguageActionType {
  SetLanguage = "setLanguage",
  NoOp = "noOp",
}

export type LanguageAction = {
  type: LanguageActionType.SetLanguage;
  language: LanguageEnum;
};

export function languageReducer(
  state: LanguageEnum,
  action: LanguageAction,
): LanguageEnum {
  switch (action.type) {
    case LanguageActionType.SetLanguage:
      return action.language;
  }
}
