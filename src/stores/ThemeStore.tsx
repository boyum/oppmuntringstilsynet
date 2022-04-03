import { useReducer } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { themeReducer } from "../reducers/theme.reducer";
import { themes } from "../types/Themes";
import { getActiveTheme } from "../utils/theme-utils";

export type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ThemeStore: React.FC<Props> = ({ children }) => {
  const isClient = typeof window === "object";
  const reducer = useReducer(
    themeReducer,
    isClient ? getActiveTheme() : themes[0],
  );

  return (
    <ThemeContext.Provider value={reducer}>{children}</ThemeContext.Provider>
  );
};
