import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { LanguageStore } from "../../stores/LanguageStore";
import { Buttons } from "./Buttons";

expect.extend(toHaveNoViolations);

describe(Buttons.name, () => {
  it("should render without accessibility errors", async () => {
    const buttons = render(
      <LanguageStore>
        <main>
          <Buttons
            handleReset={() => {
              // Intentionally empty
            }}
            handleCopy={() => {
              // Intentionally empty
            }}
          />
        </main>
      </LanguageStore>,
    ).container;

    const results = await axe(buttons);

    expect(results).toHaveNoViolations();
  });
});
