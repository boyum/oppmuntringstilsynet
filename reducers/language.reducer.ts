import LanguageEnum from "../enums/Language";

export enum LanguageActionType {
  SetLanguage = "setLanguage",
  NoOp = "noOp",
}

export type LanguageAction =
  | {
      type: LanguageActionType.SetLanguage;
      language: LanguageEnum;
    }
  | { type: LanguageActionType.NoOp };

export function languageReducer(
  state: LanguageEnum,
  action: LanguageAction,
): LanguageEnum {
  switch (action.type) {
    case LanguageActionType.SetLanguage:
      return action.language;

    case LanguageActionType.NoOp:
      return state;
  }
}
