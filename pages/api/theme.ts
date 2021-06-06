import { Theme } from "../../types/Theme";

export function getTheme(themeName: string, themes: Theme[]): Theme {
  const theme = themes.find(t => t.name === themeName);

  if (!theme) {
    throw new Error(`Invalid theme ${themeName}`);
  }

  return theme;
}

export function getActiveTheme(themes: Theme[]): Theme {
  const activeThemeName = window.localStorage.getItem("active-theme");
  const fallbackTheme = themes[0];

  return activeThemeName ? getTheme(activeThemeName, themes) : fallbackTheme;
}

export function setActiveTheme(themeName: string): void {
  window.localStorage.setItem("active-theme", themeName);
}

export function setPageTheme(theme: Theme): void {
  document.body.dataset.theme = theme.name;
}
