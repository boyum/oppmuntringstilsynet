import { createContext, Dispatch } from "react";
import { getActiveTheme } from "../pages/api/theme";
import { ThemeAction } from "../reducers/theme.reducer";
import { Theme } from "../types/Theme";
import { themes } from "../types/Themes";

const defaultState: [Theme, Dispatch<ThemeAction>] = [
  getActiveTheme(themes),
  () => {
    /* Intentionally empty */
  },
];
export default createContext(defaultState);
