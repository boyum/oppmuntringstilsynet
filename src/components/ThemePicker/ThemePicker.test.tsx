import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "../../types/Theme";
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

    expect(themePicker.dataset.isOpen).toBe("false");
    userEvent.click(themePickerButton);
    expect(themePicker.dataset.isOpen).toBe("true");
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

    expect(themePicker.dataset.isOpen).toBe("false");
    userEvent.click(themePickerButton);
    expect(themePicker.dataset.isOpen).toBe("true");
    userEvent.click(themePickerButton);
    expect(themePicker.dataset.isOpen).toBe("false");
  });

  it("should close theme picker on theme click", () => {
    const themes: Array<Theme> = [
      {
        label: "Test",
        name: "test",
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
    const themeButton =
      container.querySelector<HTMLButtonElement>("#theme-test");

    if (!themePicker || !themePickerButton || !themeButton) {
      throw new Error("Theme picker not rendered");
    }

    userEvent.click(themePickerButton);
    expect(themePicker.dataset.isOpen).toBe("true");
    userEvent.click(themeButton);
    expect(themePicker.dataset.isOpen).toBe("false");
  });
});
