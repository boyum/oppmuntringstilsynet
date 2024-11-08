import Cookies from "js-cookie";
import type { Theme } from "../types/Theme";
import type { ThemeName } from "../types/ThemeName";
import { themes } from "../types/Themes";

export function getTheme(themeName: ThemeName): Theme {
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

export function getFallbackTheme(): Theme {
  const fallbackTheme =
    themes.find(theme => theme.name === "pride") ?? themes[0];
  return fallbackTheme;
}

export function isThemeName(name: string): name is ThemeName {
  return (themes.map(theme => theme.name) as Array<string>).includes(name);
}

// export function getActiveTheme(): Theme {
//   const activeThemeName = window.localStorage.getItem("active-theme");

//   const themeExists = activeThemeName && isThemeName(activeThemeName);
//   if (themeExists) {
//     return getTheme(activeThemeName);
//   }

//   return getFallbackTheme();
// }

export function storeThemeInCookie(themeName: ThemeName): void {
  Cookies.set("theme", themeName);
}

export function setPageThemeStyles(theme: Theme): void {
  document.body.dataset["theme"] = theme.name;
}
