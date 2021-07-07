import { createContext, Dispatch } from "react";
import { getActiveTheme } from "../utils/theme-utils";
import { ThemeAction } from "../reducers/theme.reducer";
import { Theme } from "../types/Theme";
import { themes } from "../types/Themes";

const isClient = typeof window === "object";

const defaultState: [Theme, Dispatch<ThemeAction>] = [
  isClient ? getActiveTheme(themes) : themes[0],
  // @ts-expect-error this is `null` at first,
  // then React updates it behind the scenes.
  null,
];
export default createContext(defaultState);
