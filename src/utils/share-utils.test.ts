import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import { TranslationsEn } from "../types/Translations.en";
import { createMessageUrl } from "./clipboard-utils";
import { getShareTitle, share } from "./share-utils";

const message: Message = {
  date: "1st of January",
  message: "Hi, tester!",
  checks: [true, true, true],
  name: "Sindre",
  language: Language.English,
  themeName: "pride",
};

describe(getShareTitle.name, () => {
  it("should use the name of the message in the title", () => {
    const title = getShareTitle(message);

    expect(title).toBe(
      TranslationsEn.previewTitleWithMessage.replace("{name}", "Sindre"),
    );
  });

  it("should use the translation of `someone` when the message has no name", () => {
    const title = getShareTitle({ ...message, name: "" });

    expect(title).toBe(
      TranslationsEn.previewTitleWithMessage.replace(
        "{name}",
        TranslationsEn.someone,
      ),
    );
  });
});

describe(share.name, () => {
  it("should share the message with its URL and title", () => {
    const originalShare = window.navigator.share;
    const sharedWith: Array<{ title: string; url: string }> = [];

    window.navigator.share = jest.fn(args => {
      sharedWith.push(args);
      return Promise.resolve();
    }) as unknown as Navigator["share"];

    share(message);

    const expectedUrl = createMessageUrl(message, window.location.href);

    expect(sharedWith).toEqual([
      {
        title: getShareTitle(message),
        url: expectedUrl.href,
      },
    ]);

    window.navigator.share = originalShare;
  });

  it("should throw if the user cancels the share", async () => {
    const originalShare = window.navigator.share;
    const error = new DOMException("Aborted", "AbortError");

    window.navigator.share = jest.fn(() =>
      Promise.reject(error),
    ) as unknown as Navigator["share"];

    await expect(share(message)).rejects.toBe(error);

    window.navigator.share = originalShare;
  });
});
