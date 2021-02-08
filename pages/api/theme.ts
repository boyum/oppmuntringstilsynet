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

export function setCustomThemeScript(customScriptUrl: string): void {
  const id = 'custom-theme-script';

  let script = document.querySelector<HTMLScriptElement>(`#${id}`);
  if (!script) {
    script = document.createElement('script');
    script.async = true;
    script.id = id;
    document.body.appendChild(script);
  }

  script.src = customScriptUrl;
}

export function clearCustomThemeScript(): void {
  const id = 'custom-theme-script';

  const script = document.querySelector<HTMLScriptElement>(`#${id}`);

  if (script) {
    script.parentElement.removeChild(script);
  }
}

export function setPageTheme(theme: Theme): void {
  document.body.dataset.theme = theme.name;

  if (theme.customScriptUrl) {
    setCustomThemeScript(theme.customScriptUrl);
  } else {
    clearCustomThemeScript();
  }
}
