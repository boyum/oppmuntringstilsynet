import { useReducer } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { getActiveTheme } from "../utils/theme-utils";
import { themeReducer } from "../reducers/theme.reducer";
import { themes } from "../types/Themes";

type Props = {
  children: JSX.Element | JSX.Element[];
};

function ThemeStore({ children }: Props): JSX.Element {
  const isClient = typeof window === "object";
  const [theme, dispatch] = useReducer(
    themeReducer,
    isClient ? getActiveTheme(themes) : themes[0],
  );

  return (
    <ThemeContext.Provider value={[theme, dispatch]}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeStore;
