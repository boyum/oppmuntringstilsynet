import { getTheme } from "../utils/theme-utils";
import { Theme } from "../types/Theme";
import { themes } from "../types/Themes";

export enum ThemeActionType {
  SetTheme = "SetTheme",
}

export type ThemeAction = {
  type: ThemeActionType.SetTheme;
  themeName: string;
};

export function themeReducer(state: Theme, action: ThemeAction): Theme {
  switch (action.type) {
    case ThemeActionType.SetTheme: {
      const { themeName } = action;

      return getTheme(themeName, themes);
    }
  }
}
