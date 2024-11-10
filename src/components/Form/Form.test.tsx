import { act, render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { useReducer, useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { MessageContext } from "../../contexts/MessageContext";
import { Language } from "../../enums/Language";
import { getEmptyState, messageReducer } from "../../reducers/message.reducer";
import { getFallbackTheme } from "../../utils/theme-utils";
import { Form } from "./Form";

expect.extend(toHaveNoViolations);

describe(Form.name, () => {
  let l: [Language, (language: Language) => void];

  beforeEach(() => {
    l = renderHook(() => useState(Language.English as Language)).result.current;
  });

  it("should render without accessibility errors when fields are disabled", async () => {
    const [message, dispatchMessageAction] = renderHook(() =>
      useReducer(messageReducer, getEmptyState()),
    ).result.current;

    const form = render(
      <MessageContext.Provider value={[message, dispatchMessageAction]}>
        <LanguageContext.Provider value={l}>
          <main>
            <Form isDisabled />
          </main>
        </LanguageContext.Provider>
      </MessageContext.Provider>,
    ).container;

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });

  it("should render without accessibility errors when fields are not disabled", async () => {
    const [message, dispatchMessageAction] = renderHook(() =>
      useReducer(messageReducer, getEmptyState()),
    ).result.current;

    const form = render(
      <MessageContext.Provider value={[message, dispatchMessageAction]}>
        <LanguageContext.Provider value={l}>
          <main>
            <Form isDisabled={false} />
          </main>
        </LanguageContext.Provider>
      </MessageContext.Provider>,
    ).container;

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });

  it("should handle text input changes", async () => {
    const [message, dispatchMessageAction] = renderHook(() =>
      useReducer(messageReducer, {
        date: "date",
        message: "message",
        name: "name",
        checks: [false, true, false],
        language: Language.English,
        themeName: getFallbackTheme().name,
      }),
    ).result.current;

    const form = render(
      <MessageContext.Provider value={[message, dispatchMessageAction]}>
        <LanguageContext.Provider value={l}>
          <main>
            <Form isDisabled={false} />
          </main>
        </LanguageContext.Provider>
      </MessageContext.Provider>,
    ).container;

    const dateInput = form.querySelector<HTMLInputElement>("#date-field");

    if (!dateInput) {
      throw new Error("Date input not found");
    }

    const newDateValue = "new date value";

    act(() => {
      userEvent.type(dateInput, newDateValue);
    });
  });

  it("should handle checkbox changes", async () => {
    const [message, dispatchMessageAction] = renderHook(() =>
      useReducer(messageReducer, {
        date: "date",
        message: "message",
        name: "name",
        checks: [false, true, false],
        language: Language.English,
        themeName: getFallbackTheme().name,
      }),
    ).result.current;

    const form = render(
      <MessageContext.Provider value={[message, dispatchMessageAction]}>
        <LanguageContext.Provider value={l}>
          <main>
            <Form isDisabled={false} />
          </main>
        </LanguageContext.Provider>
      </MessageContext.Provider>,
    ).container;

    const checkbox = form.querySelector<HTMLInputElement>(
      "input[type=checkbox]",
    );

    if (!checkbox) {
      throw new Error("No checkboxes found");
    }

    act(() => {
      checkbox.click();
    });
  });
});
