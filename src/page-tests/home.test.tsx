import { act, fireEvent, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import type { GetServerSidePropsContext } from "next";
import { LanguageEnum } from "../enums/Language";
import Home, { getServerSideProps } from "../pages";
import { LanguageStore } from "../stores/LanguageStore";
import { ThemeStore } from "../stores/ThemeStore";
import type { Message } from "../types/Message";
import { encodeV2 } from "../utils/encoding-utils-v2";
import { encodeV3 } from "../utils/encoding-utils-v3";
import {
  QUERY_PARAM_MESSAGE_KEY_V1,
  QUERY_PARAM_MESSAGE_KEY_V2,
  QUERY_PARAM_MESSAGE_KEY_V3,
} from "../utils/url-utils";

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

expect.extend(toHaveNoViolations);
jest.mock("next/router", () => require("next-router-mock"));

describe(Home.name, () => {
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

  describe("Language", () => {
    it("should be possible to change language", () => {
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

      const languageSelect = page.querySelector<HTMLSelectElement>(
        "[data-test-id=language-select]",
      );

      if (!languageSelect) {
        throw new Error("Language select not rendered");
      }

      expect(languageSelect.value).toBe(LanguageEnum.English);

      fireEvent.change(languageSelect, {
        target: { value: LanguageEnum.NorskNynorsk },
      });

      expect(languageSelect.value).toBe(LanguageEnum.NorskNynorsk);
    });
  });

  describe("Theme", () => {
    it("should be possible to change theme", () => {
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

      const themeSelectorOpenButton = page.querySelector<HTMLButtonElement>(
        "#theme-picker-button",
      );

      if (!themeSelectorOpenButton) {
        throw new Error("Theme selector button not rendered");
      }

      const body = page.closest("body");
      if (!body) {
        throw new Error("Body not rendered");
      }

      const previousTheme = body.dataset["theme"];
      expect(previousTheme).toBe("pride");

      // Open theme selector
      act(() => {
        themeSelectorOpenButton.click();
      });

      const mooMooFarmThemeButton = page.querySelector<HTMLButtonElement>(
        "#theme-moo-moo-farm",
      );
      if (!mooMooFarmThemeButton) {
        throw new Error("Moo Moo Farm theme button not rendered");
      }

      // Change theme
      act(() => {
        mooMooFarmThemeButton.click();
      });

      const currentTheme = body.dataset["theme"];
      expect(currentTheme).toBe("moo-moo-farm");
    });
  });

  describe("Message form", () => {
    it("should be possible to fill out the form", () => {
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

      const dateField = page.querySelector<HTMLInputElement>("#date-field");
      const messageBodyField = page.querySelector<HTMLTextAreaElement>(
        "#message-body-field",
      );
      const checkbox0 = page.querySelector<HTMLInputElement>("#checkbox-0");
      const checkbox1 = page.querySelector<HTMLInputElement>("#checkbox-1");
      const checkbox2 = page.querySelector<HTMLInputElement>("#checkbox-2");
      const nameField = page.querySelector<HTMLInputElement>("#name-field");

      if (
        !dateField ||
        !messageBodyField ||
        !checkbox0 ||
        !checkbox1 ||
        !checkbox2 ||
        !nameField
      ) {
        throw new Error("Form fields not rendered");
      }

      act(() => {
        fireEvent.change(dateField, { target: { value: "date" } });
        fireEvent.change(messageBodyField, { target: { value: "message" } });
        fireEvent.click(checkbox0);
        fireEvent.click(checkbox1);
        fireEvent.click(checkbox2);
        fireEvent.change(nameField, { target: { value: "name" } });
      });

      expect(dateField.value).toBe("date");
      expect(messageBodyField.value).toBe("message");
      expect(checkbox0.checked).toBe(true);
      expect(checkbox1.checked).toBe(true);
      expect(checkbox2.checked).toBe(true);
      expect(nameField.value).toBe("name");
    });
  });

  describe("Message V1", () => {
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

        const encodedMessageV1 =
          "N4IgNghgdg5grhGBTEAuEBRWYCWBnACxABoQBjApMgazzQG0AXAJziWJbY9aQF1SAJhEYp0ARjyMABAHsAZlIBS0BMwCeJEAFskePIlEgAEjmJSRkpMwCEmqBB1oQAZRxQBzFKUaUdAOQdDAAdmHAEUAF8gA";
        const encodedMessageV3 =
          "1D5mY_DQZB46hj0rdJ4X5Z3HxYN2sjdU0KBBdhTsLFjsb4.mp54T";

        const resolvedUrl = `resolvedUrl?${QUERY_PARAM_MESSAGE_KEY_V1}=${encodedMessageV1}`;
        const host = "host";
        const context: DeepPartial<GetServerSidePropsContext> = {
          req: {
            headers: {
              "accept-language": "nb",
              host,
            },
          },
          resolvedUrl,
        };

        const serverSideProps = await getServerSideProps(
          context as GetServerSidePropsContext,
        );

        expect(serverSideProps.props).toEqual<typeof serverSideProps.props>({
          messageFromUrl,
          // Should use encoded message v2 even though v1 is provided
          encodedMessage: encodedMessageV3,
          resolvedUrl,
          deployUrl: `//${host}`,
          preferredLanguage: LanguageEnum.NorskBokmal,
        });
      });

      it("should return the correct props in a happy path, if there is no message", async () => {
        const messageFromUrl: Message | null = null;

        const context: DeepPartial<GetServerSidePropsContext> = {
          resolvedUrl: "",
          req: {
            headers: {},
          },
        };

        const serverSideProps = await getServerSideProps(
          context as GetServerSidePropsContext,
        );

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

        const messages = [
          "N4IgNghgdg5grhGBTEAuEBRWYCWBnACxABoQBjApMgazzQG0AXAJziWJbY9aQF1SAJhEYp0ARjyMABAHsAZlIBS0BMwCeJEAFskePIlEgAEjmJSRkpMwCEUgLK79yKWM1QIOtCADKOKAOYUUkZKHQA5D0MAB2YcARQAXyA",
          "N4IgNghgdg5grhGBTEAuEBRWYCWBnACxABoQBjApMgazzQG0AXAJziWJbY9aQF1SAJhEYp0ARjyMABAHsAZlIBS0BMwCeJEAFskePIlEgAEjmJSRkpMwCEUgLK79yKQCZNUCDrQgAyjigCzCikjJQ6AHKehgAOzDgCKAC%2BQA",
        ];

        const context: DeepPartial<GetServerSidePropsContext> = {
          resolvedUrl: `?${QUERY_PARAM_MESSAGE_KEY_V1}=${messages.join(`&${QUERY_PARAM_MESSAGE_KEY_V1}=`)}`,
          req: {
            headers: {},
          },
        };

        const serverSideProps = await getServerSideProps(
          context as GetServerSidePropsContext,
        );

        expect(serverSideProps.props.messageFromUrl).toEqual(messageFromUrl);
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
          "IwZwLgBA9gZhBSBDAdgV0QJwJ4B8ASAlgDQRgCm4ZGAhBIDwbgHPs4DKByAJhmTgKLIDmAGwIgAFjgAOGAu25gMqOQqWKgA";

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

        const dateText =
          page.querySelector<HTMLInputElement>("#date-field")?.value;
        const messageText = page.querySelector<HTMLTextAreaElement>(
          "#message-body-field",
        )?.value;
        const checkbox0Value =
          page.querySelector<HTMLInputElement>("#checkbox-0")?.value;
        const checkbox1Value =
          page.querySelector<HTMLInputElement>("#checkbox-1")?.value;
        const checkbox2Value =
          page.querySelector<HTMLInputElement>("#checkbox-2")?.value;
        const nameText =
          page.querySelector<HTMLInputElement>("#name-field")?.value;

        expect(dateText).toBe("1st of January");
        expect(messageText).toBe("Hi, tester! 🌸");
        expect(checkbox0Value).toBe("true");
        expect(checkbox1Value).toBe("true");
        expect(checkbox2Value).toBe("true");
        expect(nameText).toBe("Sindre");
      });
    });
  });

  describe("Message V2", () => {
    it("should return the correct props in a happy path, if there is a message", async () => {
      const messageFromUrl: Message = {
        date: "1st of January",
        message: "Hi, tester!",
        checks: [true, true, true],
        name: "Sindre",
        language: LanguageEnum.English,
        themeName: "pride",
      };

      const encodedMessageV2 = encodeV2(messageFromUrl);
      const encodedMessageV3 = encodeV3(messageFromUrl);

      const resolvedUrl = `resolvedUrl?${QUERY_PARAM_MESSAGE_KEY_V2}=${encodedMessageV2}`;
      const host = "host";
      const context: DeepPartial<GetServerSidePropsContext> = {
        req: {
          headers: {
            "accept-language": "nb",
            host,
          },
        },
        resolvedUrl,
      };

      const serverSideProps = await getServerSideProps(
        context as GetServerSidePropsContext,
      );

      expect(serverSideProps.props).toEqual<typeof serverSideProps.props>({
        messageFromUrl,
        encodedMessage: encodedMessageV3,
        resolvedUrl,
        deployUrl: `//${host}`,
        preferredLanguage: LanguageEnum.NorskBokmal,
      });
    });

    it("should return the correct props in a happy path, if there is no message", async () => {
      const messageFromUrl: Message | null = null;

      const context: DeepPartial<GetServerSidePropsContext> = {
        resolvedUrl: "",
        req: {
          headers: {},
        },
      };

      const serverSideProps = await getServerSideProps(
        context as GetServerSidePropsContext,
      );

      expect(serverSideProps.props.messageFromUrl).toEqual(messageFromUrl);
    });

    it("should return the first message if there are multiple", async () => {
      const message1: Message = {
        date: "1st of January",
        message: "Hi, tester! Message 1",
        checks: [true, true, true],
        name: "Sindre",
        language: LanguageEnum.English,
        themeName: "pride",
      };

      const message2: Message = {
        date: "1st of January",
        message: "Hi, tester! Message 2",
        checks: [true, true, true],
        name: "Sindre",
        language: LanguageEnum.English,
        themeName: "pride",
      };

      const messages = [encodeV2(message1), encodeV2(message2)];

      const context: DeepPartial<GetServerSidePropsContext> = {
        resolvedUrl: `?${QUERY_PARAM_MESSAGE_KEY_V2}=${messages.join(`&${QUERY_PARAM_MESSAGE_KEY_V2}=`)}`,
        req: {
          headers: {},
        },
      };

      const serverSideProps = await getServerSideProps(
        context as GetServerSidePropsContext,
      );

      expect(serverSideProps.props.messageFromUrl).toEqual(message1);
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
        "IwZwLgBA9gZhBSBDAdgV0QJwJ4B8ASAlgDQRgCm4ZGAhBIDwbgHPs4DKByAJhmTgKLIDmAGwIgAFjgAOGAu25gMqOQqWKgA";

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
        "IwZwLgBA9gZhBSBDAdgV0QJwJ4B8ASAlgDQRgCm4ZGAhBIDwbgHPs4DKByAJhmTgKLIDmAGwIgAFjgAOGAu25gMqOQqWKgA";

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

      const dateText =
        page.querySelector<HTMLInputElement>("#date-field")?.value;
      const messageText = page.querySelector<HTMLTextAreaElement>(
        "#message-body-field",
      )?.value;
      const checkbox0Value =
        page.querySelector<HTMLInputElement>("#checkbox-0")?.value;
      const checkbox1Value =
        page.querySelector<HTMLInputElement>("#checkbox-1")?.value;
      const checkbox2Value =
        page.querySelector<HTMLInputElement>("#checkbox-2")?.value;
      const nameText =
        page.querySelector<HTMLInputElement>("#name-field")?.value;

      expect(dateText).toBe("1st of January");
      expect(messageText).toBe("Hi, tester! 🌸");
      expect(checkbox0Value).toBe("true");
      expect(checkbox1Value).toBe("true");
      expect(checkbox2Value).toBe("true");
      expect(nameText).toBe("Sindre");
    });
  });

  describe("Message V3", () => {
    it("should return the correct props in a happy path, if there is a message", async () => {
      const messageFromUrl: Message = {
        date: "1st of January",
        message: "Hi, tester!",
        checks: [true, true, true],
        name: "Sindre",
        language: LanguageEnum.English,
        themeName: "pride",
      };

      const encodedMessageV3 = encodeV3(messageFromUrl);

      const resolvedUrl = `resolvedUrl?${QUERY_PARAM_MESSAGE_KEY_V3}=${encodedMessageV3}`;
      const host = "host";
      const context: DeepPartial<GetServerSidePropsContext> = {
        req: {
          headers: {
            "accept-language": "nb",
            host,
          },
        },
        resolvedUrl,
      };

      const serverSideProps = await getServerSideProps(
        context as GetServerSidePropsContext,
      );

      expect(serverSideProps.props).toEqual<typeof serverSideProps.props>({
        messageFromUrl,
        encodedMessage: encodedMessageV3,
        resolvedUrl,
        deployUrl: `//${host}`,
        preferredLanguage: LanguageEnum.NorskBokmal,
      });
    });

    it("should return the correct props in a happy path, if there is no message", async () => {
      const messageFromUrl: Message | null = null;

      const context: DeepPartial<GetServerSidePropsContext> = {
        resolvedUrl: "",
        req: {
          headers: {},
        },
      };

      const serverSideProps = await getServerSideProps(
        context as GetServerSidePropsContext,
      );

      expect(serverSideProps.props.messageFromUrl).toEqual(messageFromUrl);
    });

    it("should return the first message if there are multiple", async () => {
      const message1: Message = {
        date: "1st of January",
        message: "Hi, tester! Message 1",
        checks: [true, true, true],
        name: "Sindre",
        language: LanguageEnum.English,
        themeName: "pride",
      };

      const message2: Message = {
        date: "1st of January",
        message: "Hi, tester! Message 2",
        checks: [true, true, true],
        name: "Sindre",
        language: LanguageEnum.English,
        themeName: "pride",
      };

      const messages = [encodeV3(message1), encodeV3(message2)];

      const context: DeepPartial<GetServerSidePropsContext> = {
        resolvedUrl: `?${QUERY_PARAM_MESSAGE_KEY_V3}=${messages.join(`&${QUERY_PARAM_MESSAGE_KEY_V3}=`)}`,
        req: {
          headers: {},
        },
      };

      const serverSideProps = await getServerSideProps(
        context as GetServerSidePropsContext,
      );

      expect(serverSideProps.props.messageFromUrl).toEqual(message1);
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
        "IwZwLgBA9gZhBSBDAdgV0QJwJ4B8ASAlgDQRgCm4ZGAhBIDwbgHPs4DKByAJhmTgKLIDmAGwIgAFjgAOGAu25gMqOQqWKgA";

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
        "IwZwLgBA9gZhBSBDAdgV0QJwJ4B8ASAlgDQRgCm4ZGAhBIDwbgHPs4DKByAJhmTgKLIDmAGwIgAFjgAOGAu25gMqOQqWKgA";

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

      const dateText =
        page.querySelector<HTMLInputElement>("#date-field")?.value;
      const messageText = page.querySelector<HTMLTextAreaElement>(
        "#message-body-field",
      )?.value;
      const checkbox0Value =
        page.querySelector<HTMLInputElement>("#checkbox-0")?.value;
      const checkbox1Value =
        page.querySelector<HTMLInputElement>("#checkbox-1")?.value;
      const checkbox2Value =
        page.querySelector<HTMLInputElement>("#checkbox-2")?.value;
      const nameText =
        page.querySelector<HTMLInputElement>("#name-field")?.value;

      expect(dateText).toBe("1st of January");
      expect(messageText).toBe("Hi, tester! 🌸");
      expect(checkbox0Value).toBe("true");
      expect(checkbox1Value).toBe("true");
      expect(checkbox2Value).toBe("true");
      expect(nameText).toBe("Sindre");
    });
  });
});
