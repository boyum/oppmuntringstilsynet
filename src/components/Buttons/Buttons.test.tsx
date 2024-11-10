import { render, renderHook } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { Language } from "../../enums/Language";
import { Buttons } from "./Buttons";

expect.extend(toHaveNoViolations);

describe(Buttons.name, () => {
  it("should render without accessibility errors", async () => {
    const [language, setLanguage] = renderHook(() =>
      useState<Language>(Language.English),
    ).result.current;

    const buttons = render(
      <LanguageContext.Provider value={[language, setLanguage]}>
        <main>
          <Buttons
            onReset={() => {
              // Intentionally empty
            }}
            onCopy={() => {
              // Intentionally empty
            }}
          />
        </main>
      </LanguageContext.Provider>,
    ).container;

    const results = await axe(buttons);

    expect(results).toHaveNoViolations();
  });
});
