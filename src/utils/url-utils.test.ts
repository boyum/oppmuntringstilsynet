import { LanguageEnum } from "../enums/Language";
import { Message } from "../types/Message";
import {
  ACTIVE_QUERY_PARAM_MESSAGE_KEY,
  QUERY_PARAM_MESSAGE_KEY_V1,
  getEncodedAndDecodedMessage,
} from "./url-utils";

describe(getEncodedAndDecodedMessage, () => {
  it("should return the encoded and decoded message if message V2 (n) is set", () => {
    const message: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [true, true, true],
      language: LanguageEnum.English,
      themeName: "winter",
    };

    const encodedMessage =
      "CYQwLgpgPgthDO8QHNoDsRygUTcgNgJbwAWUA7oWpAE5Rg0Cu0Dz9TEQA";

    const queryParams = new URLSearchParams();
    queryParams.set(ACTIVE_QUERY_PARAM_MESSAGE_KEY, encodedMessage);

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBe(encodedMessage);
    expect(actualDecodedMessage).toEqual(message);
  });

  it("should return the encoded and decoded message if message V1 (m) is set", () => {
    const message: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [true, true, true],
      language: LanguageEnum.English,
      themeName: "winter",
    };

    const encodedMessageV1 =
      "N4IgJghgLgpiBc5pwDQgLYwM5YgczkUx31RADsJMEKqyBjACxnoGssEBtKAJwFcYKXgKH8YAXTQAbCOTx9SNAKJypASyyMQaKM0wA5OjQDua8rB4gAvkA";
    const encodedMessageV2 =
      "CYQwLgpgPgthDO8QHNoDsRygUTcgNgJbwAWUA7oWpAE5Rg0Cu0Dz9TEQA";

    const queryParams = new URLSearchParams();
    queryParams.set(QUERY_PARAM_MESSAGE_KEY_V1, encodedMessageV1);

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBe(encodedMessageV2);
    expect(actualDecodedMessage).toEqual(message);
  });

  it("should return null if no message is set", () => {
    const queryParams = new URLSearchParams();

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();
  });

  it("should return null if the message is empty", () => {
    const queryParams = new URLSearchParams();
    queryParams.set(ACTIVE_QUERY_PARAM_MESSAGE_KEY, "");

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();
  });

  it("should return null if the V2 message is malformed", () => {
    const consoleError = console.error;
    console.error = () => undefined;

    const queryParams = new URLSearchParams();
    queryParams.set(ACTIVE_QUERY_PARAM_MESSAGE_KEY, "!");

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();

    console.error = consoleError;
  });

  it("should return null if the V1 message is malformed", () => {
    const consoleError = console.error;
    console.error = () => undefined;

    const queryParams = new URLSearchParams();
    queryParams.set(QUERY_PARAM_MESSAGE_KEY_V1, "Ix");

    const [actualEncodedMessage, actualDecodedMessage] =
      getEncodedAndDecodedMessage(queryParams);

    expect(actualEncodedMessage).toBeNull();
    expect(actualDecodedMessage).toBeNull();

    console.error = consoleError;
  });
});
