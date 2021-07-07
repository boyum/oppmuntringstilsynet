import { axe } from "jest-axe";
import React from "react";
import { render } from "@testing-library/react";
import SocialMediaPreview from ".";
import Message from "../../types/Message";
import ThemeStore from "../../stores/ThemeStore";
import LanguageStore from "../../stores/LanguageStore";
import LanguageEnum from "../../enums/Language";

describe(SocialMediaPreview.name, () => {
  it("should render without accessibility errors when there's no message", async () => {
    const message: Message | null = null;
    const page = render(
      <ThemeStore>
        <LanguageStore>
          <SocialMediaPreview message={message} />
        </LanguageStore>
      </ThemeStore>,
    ).container;

    const results = await axe(page);

    expect(results).toHaveNoViolations();
  });

  it("should render without accessibility errors when there is a message", async () => {
    const message: Message = {
      date: "1st of January",
      message: "Hi, tester! 🌸",
      checks: [true, true, true],
      name: "Sindre",
      language: LanguageEnum.English,
      themeName: "pride",
    };

    const page = render(
      <ThemeStore>
        <LanguageStore>
          <SocialMediaPreview message={message} />
        </LanguageStore>
      </ThemeStore>,
    ).container;

    const results = await axe(page);

    expect(results).toHaveNoViolations();
  });
});
