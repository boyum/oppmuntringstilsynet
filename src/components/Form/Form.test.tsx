import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Form from ".";
import { getEmptyState } from "../../reducers/message.reducer";
import LanguageStore from "../../stores/LanguageStore";

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
});
