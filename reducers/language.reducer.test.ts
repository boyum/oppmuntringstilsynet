import LanguageEnum from "../enums/Language";
import {
  LanguageAction,
  LanguageActionType,
  languageReducer,
} from "./language.reducer";

describe(languageReducer.name, () => {
  describe(LanguageActionType.SetLanguage, () => {
    it("should set the language", () => {
      const state = LanguageEnum.English;
      const newLanguage = LanguageEnum.NorskNynorsk;

      const action: LanguageAction = {
        type: LanguageActionType.SetLanguage,
        language: newLanguage,
      };

      const newState = languageReducer(state, action);

      expect(newState).toBe(newLanguage);
    });
  });

  describe(LanguageActionType.NoOp, () => {
    it("should return the current state", () => {
      const state = LanguageEnum.English;

      const action: LanguageAction = {
        type: LanguageActionType.NoOp,
      };

      const newState = languageReducer(state, action);

      expect(newState).toBe(state);
    });
  });
});
