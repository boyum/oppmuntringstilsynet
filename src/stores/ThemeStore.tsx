import { type ReactNode, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { themes } from "../types/Themes";
import { getActiveTheme } from "../utils/theme-utils";

export type Props = {
  children: ReactNode;
};

export const ThemeStore: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const isBrowser = typeof window === "object";

    if (isBrowser) {
      const activeTheme = getActiveTheme();
      return activeTheme;
    }

    return themes[0];
  });

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
