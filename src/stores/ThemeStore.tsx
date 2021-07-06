import { useReducer } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { getActiveTheme } from "../pages/api/theme";
import { themeReducer } from "../reducers/theme.reducer";
import { themes } from "../types/Themes";

function MessageStore({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  const [theme, dispatch] = useReducer(themeReducer, getActiveTheme(themes));

  return (
    <ThemeContext.Provider value={[theme, dispatch]}>
      {children}
    </ThemeContext.Provider>
  );
}

export default MessageStore;
