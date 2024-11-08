import { act, render, renderHook } from "@testing-library/react";
import { useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import type { Theme } from "../../types/Theme";
import { getFallbackTheme } from "../../utils/theme-utils";
import { ThemePicker } from "./ThemePicker";

describe(ThemePicker.name, () => {
  let t: [Theme, (theme: Theme) => void];

  beforeEach(() => {
    t = renderHook(() => useState(getFallbackTheme())).result.current;
  });

  it("should open theme picker on theme picker button click, if closed", () => {
    const { container } = render(
      <ThemeContext.Provider value={t}>
        <ThemePicker />
      </ThemeContext.Provider>,
    );

    const themePicker =
      container.querySelector<HTMLDivElement>("#theme-picker");
    const themePickerButton = container.querySelector<HTMLButtonElement>(
      "#theme-picker-button",
    );

    if (!themePicker || !themePickerButton) {
      throw new Error("Theme picker not rendered");
    }

    expect(themePicker.dataset["isOpen"]).toBe("false");
    act(() => {
      themePickerButton.click();
    });
    expect(themePicker.dataset["isOpen"]).toBe("true");
  });

  it("should close theme picker on theme picker button click, if open", () => {
    const { container } = render(
      <ThemeContext.Provider value={t}>
        <ThemePicker />
      </ThemeContext.Provider>,
    );

    const themePicker =
      container.querySelector<HTMLDivElement>("#theme-picker");
    const themePickerButton = container.querySelector<HTMLButtonElement>(
      "#theme-picker-button",
    );

    if (!themePicker || !themePickerButton) {
      throw new Error("Theme picker not rendered");
    }

    expect(themePicker.dataset["isOpen"]).toBe("false");

    act(() => {
      themePickerButton.click();
    });
    expect(themePicker.dataset["isOpen"]).toBe("true");
    act(() => {
      themePickerButton.click();
    });
    expect(themePicker.dataset["isOpen"]).toBe("false");
  });

  it("should close theme picker on theme click", () => {
    const themeName = "winter";

    const { container } = render(
      <ThemeContext.Provider value={t}>
        <ThemePicker />
      </ThemeContext.Provider>,
    );

    const themePicker =
      container.querySelector<HTMLDivElement>("#theme-picker");
    const themePickerButton = container.querySelector<HTMLButtonElement>(
      "#theme-picker-button",
    );
    const themeButton = container.querySelector<HTMLButtonElement>(
      `#theme-${themeName}`,
    );

    if (!themePicker || !themePickerButton || !themeButton) {
      throw new Error("Theme picker not rendered");
    }

    act(() => {
      themePickerButton.click();
    });
    expect(themePicker.dataset["isOpen"]).toBe("true");
    act(() => {
      themeButton.click();
    });
    expect(themePicker.dataset["isOpen"]).toBe("false");
  });
});
