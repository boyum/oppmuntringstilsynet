import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/router";
import Home from "../pages";
import LanguageStore from "../stores/LanguageStore";
import ThemeStore from "../stores/ThemeStore";
import Message from "../types/Message";

expect.extend(toHaveNoViolations);

describe(Home.name, () => {
  it("should render without accessibility errors when no message", async () => {
    const messageFromUrl: Message | null = null;
    const page = render(
      <ThemeStore>
        <LanguageStore>
          <Home messageFromUrl={messageFromUrl} resolvedUrl="" />
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
            <Home messageFromUrl={messageFromUrl} resolvedUrl="" />
          </LanguageStore>
        </ThemeStore>,
      ).container;

      document.execCommand = jest.fn();

      const copyButton = page.querySelector<HTMLButtonElement>("#copy-button");
      const dateField = page.querySelector<HTMLInputElement>("#date-field");

      if (!copyButton || !dateField) {
        throw new Error("Copy button or date field not rendered");
      }

      dateField.value = "date";
      copyButton.click();

      expect(document.execCommand).toHaveBeenCalledWith("copy");
    });
  });

  describe("Reset button", () => {
    it("should reset the form on click", () => {
      const mockRouter: NextRouter = {
        basePath: "",
        pathname: "/",
        route: "/",
        asPath: "/",
        query: {},
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
        beforePopState: jest.fn(),
        events: {
          on: jest.fn(),
          off: jest.fn(),
          emit: jest.fn(),
        },
        isFallback: false,
        isLocaleDomain: false,
        isReady: false,
        isPreview: false,
      };

      const messageFromUrl: Message | null = null;

      const page = render(
        <RouterContext.Provider value={{ ...mockRouter }}>
          <ThemeStore>
            <LanguageStore>
              <Home messageFromUrl={messageFromUrl} resolvedUrl="" />
            </LanguageStore>
          </ThemeStore>
        </RouterContext.Provider>,
      ).container;

      document.execCommand = jest.fn();

      const resetButton =
        page.querySelector<HTMLButtonElement>("#reset-button");
      const dateField = page.querySelector<HTMLInputElement>("#date-field");

      if (!resetButton || !dateField) {
        throw new Error("Reset button or date field not rendered");
      }

      dateField.value = "date";
      expect(dateField.value).toBe("date");

      resetButton.click();

      expect(dateField.value).toBe("");
    });
  });
});
