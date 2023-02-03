import type { themes } from "./Themes";

export type ThemeName = (typeof themes)[number]["name"];
