import { createContext, Dispatch } from "react";
import { getActiveTheme } from "../utils/theme-utils";
import { ThemeAction } from "../reducers/theme.reducer";
import { Theme } from "../types/Theme";
import { themes } from "../types/Themes";

const isClient = typeof window === "object";

const defaultState: [Theme, Dispatch<ThemeAction>] = [
  isClient ? getActiveTheme(themes) : themes[0],
  () => {
    /* Intentionally empty */
  },
];
export default createContext(defaultState);
