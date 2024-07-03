import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import type { GetServerSidePropsContext } from "next";
import { act } from "react";
import { LanguageEnum } from "../enums/Language";
import Home, { getServerSideProps } from "../pages";
import { LanguageStore } from "../stores/LanguageStore";
import { ThemeStore } from "../stores/ThemeStore";
import type { Message } from "../types/Message";

expect.extend(toHaveNoViolations);
jest.mock("next/router", () => require("next-router-mock"));

describe(Home.name, () => {
  it("should render with a message", () => {
    const message: Message = {
      date: "1st of January",
      message: "Hi, tester! 🌸",
      checks: [true, true, true],
      name: "Sindre",
      language: LanguageEnum.English,
      themeName: "pride",
    };

    const encodedMessage =
      "N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmRAEZ40ACAewDMWApKgOyxUMATxDkAtlHjwqAczpIQACQCWuFrWZQMAQhaAeDcAc%2B2JB8qk%2BgGUVfChjrkANv1mD59AKJ9ZjlfAgmaNCSAHLmCiAADhgqFHQAvkA";

    const page = render(
      <ThemeStore>
        <LanguageStore>
          <Home
            encodedMessage={encodedMessage}
            messageFromUrl={message}
            resolvedUrl=""
            deployUrl=""
            preferredLanguage={LanguageEnum.English}
          />
        </LanguageStore>
      </ThemeStore>,
    ).container;

    const dateText = page.querySelector<HTMLInputElement>("#date-field")?.value;
    const messageText = page.querySelector<HTMLTextAreaElement>(
      "#message-body-field",
    )?.value;
    const checkbox0Value =
      page.querySelector<HTMLInputElement>("#checkbox-0")?.value;
    const checkbox1Value =
      page.querySelector<HTMLInputElement>("#checkbox-1")?.value;
    const checkbox2Value =
      page.querySelector<HTMLInputElement>("#checkbox-2")?.value;
    const nameText = page.querySelector<HTMLInputElement>("#name-field")?.value;

    expect(dateText).toBe("1st of January");
    expect(messageText).toBe("Hi, tester! 🌸");
    expect(checkbox0Value).toBe("true");
    expect(checkbox1Value).toBe("true");
    expect(checkbox2Value).toBe("true");
    expect(nameText).toBe("Sindre");
  });

  it("should render without accessibility errors when no message", async () => {
    const messageFromUrl: Message | null = null;
    const page = render(
      <ThemeStore>
        <LanguageStore>
          <Home
            encodedMessage=""
            messageFromUrl={messageFromUrl}
            resolvedUrl=""
            deployUrl=""
            preferredLanguage={LanguageEnum.English}
          />
        </LanguageStore>
      </ThemeStore>,
    ).container;

    const results = await axe(page);

    expect(results).toHaveNoViolations();
  });

  it("should render without accessibility errors when there is a message", async () => {
    const messageFromUrl: Message = {
      date: "1st of January",
      message: "Hi, tester! 🌸",
      checks: [true, true, true],
      name: "Sindre",
      language: LanguageEnum.English,
      themeName: "pride",
    };

    const encodedMessage =
      "N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmRAEZ40ACAewDMWApKgOyxUMATxDkAtlHjwqAczpIQACQCWuFrWZQMAQhaAeDcAc%2B2JB8qk%2BgGUVfChjrkANv1mD59AKJ9ZjlfAgmaNCSAHLmCiAADhgqFHQAvkA";

    const page = render(
      <ThemeStore>
        <LanguageStore>
          <Home
            encodedMessage={encodedMessage}
            messageFromUrl={messageFromUrl}
            resolvedUrl=""
            deployUrl=""
            preferredLanguage={LanguageEnum.English}
          />
        </LanguageStore>
      </ThemeStore>,
    ).container;

    const results = await axe(page);

    expect(results).toHaveNoViolations();
  });

  describe("Copy button", () => {
    it("should copy a link to the card on click", () => {
      const messageFromUrl: Message | null = null;

      const page = render(
        <ThemeStore>
          <LanguageStore>
            <Home
              encodedMessage=""
              messageFromUrl={messageFromUrl}
              resolvedUrl=""
              deployUrl=""
              preferredLanguage={LanguageEnum.English}
            />
          </LanguageStore>
        </ThemeStore>,
      ).container;

      document.execCommand = jest.fn();

      const copyButton = page.querySelector<HTMLButtonElement>("#copy-button");
      const dateField = page.querySelector<HTMLInputElement>("#date-field");

      if (!copyButton || !dateField) {
        throw new Error("Copy button or date field not rendered");
      }

      act(() => {
        dateField.value = "date";
      });

      copyButton.click();

      expect(document.execCommand).toHaveBeenCalledWith("copy");
    });
  });

  describe("Reset button", () => {
    it("should reset the form on click", () => {
      const messageFromUrl: Message | null = null;

      const page = render(
        <ThemeStore>
          <LanguageStore>
            <Home
              encodedMessage=""
              messageFromUrl={messageFromUrl}
              resolvedUrl=""
              deployUrl=""
              preferredLanguage={LanguageEnum.English}
            />
          </LanguageStore>
        </ThemeStore>,
      ).container;

      document.execCommand = jest.fn();

      const resetButton =
        page.querySelector<HTMLButtonElement>("#reset-button");
      const dateField = page.querySelector<HTMLInputElement>("#date-field");

      if (!resetButton || !dateField) {
        throw new Error("Reset button or date field not rendered");
      }

      act(() => {
        dateField.value = "date";
      });
      expect(dateField.value).toBe("date");

      act(() => {
        resetButton.click();
      });

      expect(dateField.value).toBe("");
    });
  });
});

describe(getServerSideProps.name, () => {
  it("should return the correct props in a happy path, if there is a message", async () => {
    const messageFromUrl: Message = {
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

    expect(serverSideProps.props).toEqual<typeof serverSideProps.props>({
      messageFromUrl,
      encodedMessage,
      resolvedUrl,
      deployUrl: `//${host}`,
      preferredLanguage: LanguageEnum.NorskBokmal,
    });
  });

  it("should return the correct props in a happy path, if there is no message", async () => {
    const messageFromUrl: Message | null = null;

    const context = {
      query: {},
      req: {
        host: null,
        headers: {},
      },
    } as unknown as GetServerSidePropsContext;

    const serverSideProps = await getServerSideProps(context);

    expect(serverSideProps.props.messageFromUrl).toEqual(messageFromUrl);
  });
  it("should return the first message if there are multiple", async () => {
    const messageFromUrl: Message = {
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

    expect(serverSideProps.props.messageFromUrl).toEqual(messageFromUrl);
  });
});
