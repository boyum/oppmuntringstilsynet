import LanguageEnum from "../enums/Language";

type Message = {
  date: string;
  message: string;
  checks: boolean[];
  name: string;
  language: LanguageEnum;
  themeName: string;
};

export default Message;
