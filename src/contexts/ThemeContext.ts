import { createContext } from "react";
import type { Theme } from "../types/Theme";
import { themes } from "../types/Themes";
import { getActiveTheme } from "../utils/theme-utils";

const isBrowser = typeof window === "object";

const defaultState: [Theme, (theme: Theme) => void] = [
  isBrowser ? getActiveTheme() : themes[0],
  // @ts-expect-error this is `null` at first,
  // then React updates it behind the scenes.
  null,
];

export const ThemeContext = createContext(defaultState);
