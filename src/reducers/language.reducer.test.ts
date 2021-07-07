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
});
