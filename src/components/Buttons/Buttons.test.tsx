import { render, renderHook } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { LanguageEnum } from "../../enums/Language";
import { Buttons } from "./Buttons";

expect.extend(toHaveNoViolations);

describe(Buttons.name, () => {
  it("should render without accessibility errors", async () => {
    const [language, setLanguage] = renderHook(() =>
      useState<LanguageEnum>(LanguageEnum.English),
    ).result.current;

    const buttons = render(
      <LanguageContext.Provider value={[language, setLanguage]}>
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
      </LanguageContext.Provider>,
    ).container;

    const results = await axe(buttons);

    expect(results).toHaveNoViolations();
  });
});
