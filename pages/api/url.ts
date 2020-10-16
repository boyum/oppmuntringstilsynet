import LZString from 'lz-string';

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
