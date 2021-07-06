import { Theme } from "../../types/Theme";

export function getTheme(themeName: string, themes: readonly Theme[]): Theme {
  const theme = themes.find(t => t.name === themeName);

  if (!theme) {
    // This might happen if the last theme the user used –
    // or the theme of the opened card – was deleted.
    // Instead of throwing an error,
    // we'll just return the default theme.
    return themes[0];
  }

  return theme;
}

export function getActiveTheme(themes: readonly Theme[]): Theme {
  const activeThemeName = window.localStorage.getItem("active-theme");
  const fallbackTheme =
    themes.find(theme => theme.name === "pride") ?? themes[0];

  return activeThemeName ? getTheme(activeThemeName, themes) : fallbackTheme;
}

export function setActiveTheme(themeName: string): void {
  window.localStorage.setItem("active-theme", themeName);
}

export function setPageTheme(theme: Theme): void {
  document.body.dataset.theme = theme.name;
}
