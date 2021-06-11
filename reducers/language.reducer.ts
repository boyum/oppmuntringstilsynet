import LanguageEnum from "../enums/Language";

export enum LanguageActionType {
  SetLanguage = "setLanguage",
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
    case LanguageActionType.SetLanguage: {
      return action.language;
    }
    default:
      throw new Error(
        `Invalid action type '${action.type}' in ${languageReducer.name}.`,
      );
  }
}
