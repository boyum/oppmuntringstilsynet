import type { Theme } from "../types/Theme";
import type { ThemeName } from "../types/ThemeName";
import { getTheme } from "../utils/theme-utils";

export enum ThemeActionType {
  SetTheme = "SetTheme",
}

export type ThemeAction = {
  type: ThemeActionType.SetTheme;
  themeName: ThemeName;
};

export function themeReducer(_state: Theme, action: ThemeAction): Theme {
  switch (action.type) {
    case ThemeActionType.SetTheme: {
      const { themeName } = action;

      return getTheme(themeName);
    }
  }
}
