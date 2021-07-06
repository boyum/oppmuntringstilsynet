import { themes } from "../types/Themes";
import { ThemeAction, ThemeActionType, themeReducer } from "./theme.reducer";

describe(themeReducer.name, () => {
  it("should set a new theme", () => {
    const state = themes.find(theme => theme.name === "original");
    const newTheme = themes.find(theme => theme.name === "pride");

    if (!state) {
      throw new Error("Theme 'original' does not exist");
    }

    if (!newTheme) {
      throw new Error("Theme 'pride' does not exist");
    }

    const action: ThemeAction = {
      type: ThemeActionType.SetTheme,
      themeName: newTheme.name,
    };

    const expectedTheme = themes.find(theme => theme.name === "pride");
    const actualTheme = themeReducer(state, action);

    expect(actualTheme).toEqual(expectedTheme);
  });
});
