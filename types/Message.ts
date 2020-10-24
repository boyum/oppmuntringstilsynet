import {default as LanguageEnum} from "../enums/Language";

type Message = {
	date: string;
	message: string;
	checks: Array<boolean>;
	name: string;
	language: LanguageEnum;
};

export default Message;
