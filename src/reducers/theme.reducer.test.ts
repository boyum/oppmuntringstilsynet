import { getTheme } from "../pages/api/theme";
import { Theme } from "../types/Theme";
import { themes } from "../types/Themes";

export enum ThemeActionType {
  SetTheme = "SetTheme",
}

export type ThemeAction = {
  type: ThemeActionType.SetTheme;
  themeName: typeof themes[number]["name"];
};

export function themeReducer(state: Theme, action: ThemeAction): Theme {
  switch (action.type) {
    case ThemeActionType.SetTheme: {
      const { themeName } = action;

      return getTheme(themeName, themes);
    }
  }
}

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
