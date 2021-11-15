import { LanguageEnum } from "../enums/Language";

export type Message = {
  date: string;
  message: string;
  checks: [boolean, boolean, boolean];
  name: string;
  language: LanguageEnum;
  themeName: string;
};
