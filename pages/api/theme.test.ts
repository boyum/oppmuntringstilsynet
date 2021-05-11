import { Theme } from "../../types/Theme";
import { getActiveTheme, getTheme, setActiveTheme } from "./theme";

describe(getTheme.name, () => {
  it("should return the theme with the given themeName", () => {
    const themeName = "theme-1";
    const themes: Theme[] = [
      {
        label: "label",
        name: "theme-1",
      },
      {
        label: "label",
        name: "theme-2",
      },
    ];

    const expectedTheme = themes[0];
    const actualTheme = getTheme(themeName, themes);

    expect(actualTheme).toEqual(expectedTheme);
  });

  it("should throw if the given theme name doesn't match any themes", () => {
    const themeName = "theme-3";
    const themes: Theme[] = [
      {
        label: "label",
        name: "theme-1",
      },
      {
        label: "label",
        name: "theme-2",
      },
    ];

    expect(() => getTheme(themeName, themes)).toThrowError();
  });
});

describe(getActiveTheme.name, () => {
  it("should return a fallback theme if no active theme is set", () => {
    const themes: Theme[] = [
      {
        label: "label",
        name: "theme-1",
      },
      {
        label: "label",
        name: "theme-2",
      },
    ];

    const expectedTheme = themes[0];
    const actualTheme = getActiveTheme(themes);

    expect(actualTheme).toEqual(expectedTheme);
  });

  it("should get the current active theme", () => {
    const themes: Theme[] = [
      {
        label: "label",
        name: "theme-1",
      },
      {
        label: "label",
        name: "theme-2",
      },
    ];

    setActiveTheme("theme-2");

    const expectedTheme = themes[1];
    const actualTheme = getActiveTheme(themes);

    expect(actualTheme).toEqual(expectedTheme);
  });
});
