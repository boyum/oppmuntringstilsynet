import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import Form from "./Form";
import LanguageEnum from "../../enums/Language";
import { getEmptyState } from "../../reducers/message.reducer";
import LanguageStore from "../../stores/LanguageStore";
import Message from "../../types/Message";

expect.extend(toHaveNoViolations);

describe(Form.name, () => {
  it("should render without accessibility errors when fields are disabled", async () => {
    const message = getEmptyState();

    const form = render(
      <LanguageStore>
        <main>
          <Form
            isDisabled
            message={message}
            setMessage={() => {
              /* Intentionally empty */
            }}
            setCheck={() => {
              /* Intentionally empty */
            }}
          />
        </main>
      </LanguageStore>,
    ).container;

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });

  it("should render without accessibility errors when fields are not disabled", async () => {
    const message = getEmptyState();
    const form = render(
      <LanguageStore>
        <main>
          <Form
            isDisabled={false}
            message={message}
            setMessage={() => {
              /* Intentionally empty */
            }}
            setCheck={() => {
              /* Intentionally empty */
            }}
          />
        </main>
      </LanguageStore>,
    ).container;

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });

  it("should handle text input changes", async () => {
    const message: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [false, true, false],
      language: LanguageEnum.English,
      themeName: "themeName",
    };

    const form = render(
      <LanguageStore>
        <main>
          <Form
            isDisabled={false}
            message={message}
            setMessage={() => {
              /* Intentionally empty */
            }}
            setCheck={() => {
              /* Intentionally empty */
            }}
          />
        </main>
      </LanguageStore>,
    ).container;

    const dateInput = form.querySelector<HTMLInputElement>("#date-field");

    if (!dateInput) {
      throw new Error("Date input not found");
    }

    const newDateValue = "new date value";

    userEvent.type(dateInput, newDateValue);
  });

  it("should handle checkbox changes", async () => {
    const message: Message = {
      date: "date",
      message: "message",
      name: "name",
      checks: [false, true, false],
      language: LanguageEnum.English,
      themeName: "themeName",
    };

    const form = render(
      <LanguageStore>
        <main>
          <Form
            isDisabled={false}
            message={message}
            setMessage={() => {
              /* Intentionally empty */
            }}
            setCheck={() => {
              /* Intentionally empty */
            }}
          />
        </main>
      </LanguageStore>,
    ).container;

    const checkbox = form.querySelector<HTMLInputElement>(
      "input[type=checkbox]",
    );

    if (!checkbox) {
      throw new Error("No checkboxes found");
    }

    userEvent.click(checkbox);
  });
});
