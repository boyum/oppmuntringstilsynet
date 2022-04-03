import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import type { GetServerSidePropsContext } from "next";
import React from "react";
import { LanguageEnum } from "../enums/Language";
import SocialMediaPreview, {
  getServerSideProps,
} from "../pages/social-media-preview";
import { LanguageStore } from "../stores/LanguageStore";
import { ThemeStore } from "../stores/ThemeStore";
import type { Message } from "../types/Message";

expect.extend(toHaveNoViolations);

describe(SocialMediaPreview.name, () => {
  it("should render without accessibility errors when there's no message", async () => {
    const message: Message | null = null;
    const page = render(
      <ThemeStore>
        <LanguageStore>
          <SocialMediaPreview
            message={message}
            preferredLanguage={LanguageEnum.English}
          />
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
          <SocialMediaPreview
            message={message}
            preferredLanguage={LanguageEnum.English}
          />
        </LanguageStore>
      </ThemeStore>,
    ).container;

    const results = await axe(page);

    expect(results).toHaveNoViolations();
  });
});

describe(getServerSideProps.name, () => {
  it("should return the correct props in a happy path, if there is a message", async () => {
    const message: Message = {
      date: "1st of January",
      message: "Hi, tester!",
      checks: [true, true, true],
      name: "Sindre",
      language: LanguageEnum.English,
      themeName: "pride",
    };
    const encodedMessage =
      "N4IgNghgdg5grhGBTEAuEBRWYCWBnACxABoQBjApMgazzQG0AXAJziWJbY9aQF1SAJhEYp0ARjyMABAHsAZlIBS0BMwCeJEAFskePIlEgAEjmJSRkpMwCEmqBB1oQAZRxQBzFKUaUdAOQdDAAdmHAEUAF8gA";

    const resolvedUrl = "resolvedUrl";
    const host = "host";
    const context = {
      query: {
        m: encodedMessage,
      },
      req: {
        host: "",
        headers: {
          "accept-language": "nb",
          host,
        },
      },
      resolvedUrl,
    } as unknown as GetServerSidePropsContext;

    const serverSideProps = await getServerSideProps(context);

    expect(serverSideProps.props).toEqual({
      message,
      preferredLanguage: LanguageEnum.NorskBokmal,
    });
  });

  it("should return the correct props in a happy path, if there is no message", async () => {
    const message: Message | null = null;

    const context = {
      query: {},
      req: {
        host: null,
        headers: {},
      },
    } as unknown as GetServerSidePropsContext;

    const serverSideProps = await getServerSideProps(context);

    expect(serverSideProps.props.message).toEqual(message);
  });
  it("should return the first message if there are multiple", async () => {
    const message: Message = {
      date: "1st of January",
      message: "Hi, tester! Message 1",
      checks: [true, true, true],
      name: "Sindre",
      language: LanguageEnum.English,
      themeName: "pride",
    };

    const context = {
      query: {
        m: [
          "N4IgNghgdg5grhGBTEAuEBRWYCWBnACxABoQBjApMgazzQG0AXAJziWJbY9aQF1SAJhEYp0ARjyMABAHsAZlIBS0BMwCeJEAFskePIlEgAEjmJSRkpMwCEUgLK79yKWM1QIOtCADKOKAOYUUkZKHQA5D0MAB2YcARQAXyA",
          "N4IgNghgdg5grhGBTEAuEBRWYCWBnACxABoQBjApMgazzQG0AXAJziWJbY9aQF1SAJhEYp0ARjyMABAHsAZlIBS0BMwCeJEAFskePIlEgAEjmJSRkpMwCEUgLK79yKQCZNUCDrQgAyjigCzCikjJQ6AHKehgAOzDgCKAC%2BQA",
        ],
      },
      req: {
        host: null,
        headers: {},
      },
    } as unknown as GetServerSidePropsContext;

    const serverSideProps = await getServerSideProps(context);

    expect(serverSideProps.props.message).toEqual(message);
  });
});
