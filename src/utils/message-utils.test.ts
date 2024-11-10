import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import type { ThemeName } from "../types/ThemeName";
import { createEmptyMessage } from "./message-utils";

const defaultThemeName: ThemeName = "pride";

describe(createEmptyMessage.name, () => {
  it("should return an empty message", () => {
    const actualMessage = createEmptyMessage();
    const expectedMessage: Message = {
      date: "",
      message: "",
      name: "",
      checks: [false, false, false],
      language: Language.NorskBokmal,
      themeName: defaultThemeName,
    };

    expect(actualMessage).toEqual(expectedMessage);
  });
});
