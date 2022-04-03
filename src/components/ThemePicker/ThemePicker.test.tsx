import { act, render } from "@testing-library/react";
import type { Theme } from "../../types/Theme";
import { ThemePicker } from "./ThemePicker";

describe(ThemePicker.name, () => {
  it("should open theme picker on theme picker button click, if closed", () => {
    const themes: Array<Theme> = [];
    const setTheme = () => {
      /* Intentionally empty */
    };

    const { container } = render(
      <ThemePicker themes={themes} setTheme={setTheme} />,
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
    const themes: Array<Theme> = [];
    const setTheme = () => {
      /* Intentionally empty */
    };

    const { container } = render(
      <ThemePicker themes={themes} setTheme={setTheme} />,
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

    const themes: Array<Theme> = [
      {
        label: "Winter",
        name: themeName,
      },
    ];
    const setTheme = () => {
      /* Intentionally empty */
    };

    const { container } = render(
      <ThemePicker themes={themes} setTheme={setTheme} />,
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
