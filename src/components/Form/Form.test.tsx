import { act, render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { useReducer, useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { MessageContext } from "../../contexts/MessageContext";
import { LanguageEnum } from "../../enums/Language";
import { messageReducer } from "../../reducers/message.reducer";
import { MessageStore } from "../../stores/MessageStore";
import { getFallbackTheme } from "../../utils/theme-utils";
import { Form } from "./Form";

expect.extend(toHaveNoViolations);

describe(Form.name, () => {
  let l: [LanguageEnum, (language: LanguageEnum) => void];

  beforeEach(() => {
    l = renderHook(() => useState(LanguageEnum.English as LanguageEnum)).result
      .current;
  });

  it("should render without accessibility errors when fields are disabled", async () => {
    const form = render(
      <MessageStore>
        <LanguageContext.Provider value={l}>
          <main>
            <Form isDisabled />
          </main>
        </LanguageContext.Provider>
      </MessageStore>,
    ).container;

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });

  it("should render without accessibility errors when fields are not disabled", async () => {
    const form = render(
      <MessageStore>
        <LanguageContext.Provider value={l}>
          <main>
            <Form isDisabled={false} />
          </main>
        </LanguageContext.Provider>
      </MessageStore>,
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
        language: LanguageEnum.English,
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
        language: LanguageEnum.English,
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
