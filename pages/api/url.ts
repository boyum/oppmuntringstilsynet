import {default as LZString} from "lz-string";
import {default as LanguageEnum} from "../../enums/Language";
import {default as Message} from "../../types/Message";

export function encode(obj: object): string {
	const json = JSON.stringify(obj);

	return LZString.compressToEncodedURIComponent(json);
}

export function decode<Type>(encodedObj: string): Type {
	const hasObj = !!encodedObj;

	if (!hasObj) {
		return null;
	}

	return JSON.parse(LZString.decompressFromEncodedURIComponent(encodedObj));
}

export function decodeMessage(encodedObj: string): Message {
	const hasObj = !!encodedObj;

	if (!hasObj) {
		return null;
	}

	const defaultValuesForBackwardsCompatibility = {
		language: LanguageEnum.NorskBokmal,
	};

	return {
		...defaultValuesForBackwardsCompatibility,
		...decode<Message>(encodedObj),
	};
}
