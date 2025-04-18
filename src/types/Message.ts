import type { Language } from "../enums/Language";
import type { Checks } from "./Checks";
import type { ThemeName } from "./ThemeName";

export type Message = {
  date: string;
  message: string;
  checks: Checks;
  name: string;
  language: Language;
  themeName: ThemeName;
};
