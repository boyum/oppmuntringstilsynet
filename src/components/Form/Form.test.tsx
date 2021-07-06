import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Form from ".";
import LanguageStore from "../../stores/LanguageStore";
import MessageStore from "../../stores/MessageStore";

expect.extend(toHaveNoViolations);

describe(Form.name, () => {
  it("should render without accessibility errors when fields are disabled", async () => {
    const form = render(
      <MessageStore>
        <LanguageStore>
          <main>
            <Form isDisabled />
          </main>
        </LanguageStore>
      </MessageStore>,
    ).container;

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });

  it("should render without accessibility errors when fields are not disabled", async () => {
    const form = render(
      <MessageStore>
        <LanguageStore>
          <main>
            <Form isDisabled />
          </main>
        </LanguageStore>
      </MessageStore>,
    ).container;

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });
});
