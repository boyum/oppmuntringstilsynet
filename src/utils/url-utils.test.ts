import LanguageEnum from '../enums/Language';
import Message from '../types/Message';
import { encode, decodeMessage } from './url-utils';

describe("Message encoder/decoder", () => {
  it("should encode and decode a Message such that it stays the same", () => {
    const expectedMessage: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [false, true, false],
      language: LanguageEnum.English,
      themeName: "themeName",
    };

    const encodedMessage = encode(expectedMessage);
    const actualMessage = decodeMessage(encodedMessage);

    expect(actualMessage).toEqual(expectedMessage);
  });
});
