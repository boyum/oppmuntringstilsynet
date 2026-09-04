import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import SocialMediaPreview from "../app/social-media-preview/social-media-preview";
import { Language } from "../enums/Language";
import type { Message } from "../types/Message";
import { getShareTitle } from "../utils/share-utils";
import { getTranslations } from "../utils/translations-utils";

expect.extend(toHaveNoViolations);

const message: Message = {
  date: "1st of January",
  message: "Hi, tester!",
  checks: [true, true, true],
  name: "Sindre",
  language: Language.English,
  themeName: "winter",
};

describe(SocialMediaPreview.name, () => {
  it("should render the preview title of a message", () => {
    const page = render(
      <SocialMediaPreview
        message={message}
        preferredLanguage={Language.English}
      />,
    ).container;

    const heading = page.querySelector("h1");
    expect(heading?.textContent).toBe(getShareTitle(message));
  });

  it("should render the fallback title when there is no message", () => {
    const page = render(
      <SocialMediaPreview
        message={null}
        preferredLanguage={Language.English}
      />,
    ).container;

    const heading = page.querySelector("h1");
    expect(heading?.textContent).toBe(
      getTranslations(Language.English).previewTitleWithoutMessage,
    );
  });

  it("should apply the message's theme", () => {
    render(
      <SocialMediaPreview
        message={message}
        preferredLanguage={Language.English}
      />,
    );

    expect(document.body.dataset["theme"]).toBe("winter");
  });

  it("should apply the fallback theme when the message has none", () => {
    render(
      <SocialMediaPreview
        message={null}
        preferredLanguage={Language.English}
      />,
    );

    expect(document.body.dataset["theme"]).toBe("pride");
  });

  it("should render without accessibility errors", async () => {
    const page = render(
      <SocialMediaPreview
        message={message}
        preferredLanguage={Language.English}
      />,
    ).container;

    const results = await axe(page);
    expect(results).toHaveNoViolations();
  });
});
