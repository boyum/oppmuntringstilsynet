import type { ThemeName } from "../types/ThemeName";
import { themes } from "../types/Themes";
import { getTheme, isThemeName } from "./theme-utils";

describe(getTheme.name, () => {
  it("should return the theme with the given themeName", () => {
    const expectedTheme = themes[0];
    const actualTheme = getTheme(expectedTheme.name);

    expect(actualTheme).toEqual(expectedTheme);
  });

  it("should return the first theme if the given theme name doesn't match any themes", () => {
    const themeName = "theme-3" as ThemeName;

    const expectedTheme = themes[0];
    const actualTheme = getTheme(themeName);

    expect(actualTheme).toEqual(expectedTheme);
  });
});

describe(isThemeName.name, () => {
  it("should return true if given an existing theme's name", () => {
    for (const { name } of themes) {
      expect(isThemeName(name)).toBeTruthy();
    }
  });

  it("should return false if given a name that is not a theme's name", () => {
    expect(isThemeName("Not a theme ⚠️")).toBeFalsy();
  });
});
