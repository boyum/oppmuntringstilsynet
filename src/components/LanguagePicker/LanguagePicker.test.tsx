import { render, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import LanguagePicker from "./LanguagePicker";
import LanguageEnum from "../../enums/Language";

expect.extend(toHaveNoViolations);

describe(LanguagePicker.name, () => {
  it("should render without accessibility errors", async () => {
    const languagePicker = render(
      <main>
        <LanguagePicker
          handleChange={() => {
            // Intentionally empty
          }}
        />
      </main>,
    ).container;

    const results = await axe(languagePicker);

    expect(results).toHaveNoViolations();
  });

  it("should handle changes", () => {
    const handleChange = jest.fn();
    const languagePicker = render(
      <main>
        <LanguagePicker handleChange={handleChange} />
      </main>,
    ).container;

    const select = languagePicker.querySelector<HTMLSelectElement>("select");
    if (!select) {
      throw new Error("Option not found");
    }

    fireEvent.change(select, {
      currentTarget: { value: LanguageEnum.English },
    });

    expect(handleChange).toHaveBeenCalled();
  });
});
