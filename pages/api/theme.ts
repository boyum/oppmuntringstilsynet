import { Theme } from '../../types/Theme';

export function getTheme(themeName: string, themes: Theme[]): Theme {
  return themes.find((theme) => theme.name === themeName);
}

export function getActiveTheme(themes: Theme[]): Theme {
  const activeThemeName = window.localStorage.getItem('active-theme');

  return activeThemeName ? getTheme(activeThemeName, themes) : themes[0];
}

export function setActiveTheme(themeName: string): void {
  window.localStorage.setItem('active-theme', themeName);
}

export function setPageTheme(theme: Theme): void {
  document.body.dataset.theme = theme.name;
}
