import { createContext, Dispatch } from "react";
import type { ThemeAction } from "../reducers/theme.reducer";
import type { Theme } from "../types/Theme";
import { themes } from "../types/Themes";
import { getActiveTheme } from "../utils/theme-utils";

const isClient = typeof window === "object";

const defaultState: [Theme, Dispatch<ThemeAction>] = [
  isClient ? getActiveTheme() : themes[0],
  // @ts-expect-error this is `null` at first,
  // then React updates it behind the scenes.
  null,
];

export const ThemeContext = createContext(defaultState);
