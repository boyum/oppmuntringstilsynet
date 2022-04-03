import type { LanguageEnum } from "../enums/Language";
import type { ThemeName } from "./ThemeName";

export type Message = {
  date: string;
  message: string;
  checks: [boolean, boolean, boolean];
  name: string;
  language: LanguageEnum;
  themeName: ThemeName;
};
