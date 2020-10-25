import LZString from 'lz-string';
import LanguageEnum from '../../enums/Language';
import Message from '../../types/Message';

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
