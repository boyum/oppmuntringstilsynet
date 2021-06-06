import React from "react";
import { Theme } from "../../types/Theme";
import styles from "./ThemePickerTheme.module.scss";

type Props = {
  theme: Theme;
  isSelected: boolean;
  onClick: (themeName: string) => void;
};

export function ThemePickerTheme(props: Props): JSX.Element {
  const { theme, isSelected, onClick } = props;

  const classNames = [isSelected ? styles.isSelected : ""].join(" ");

  return (
    <li className={classNames} data-theme={theme.name}>
      <button
        id={`theme-${theme.name}`}
        className={styles.button}
        type="button"
        onClick={() => onClick(theme.name)}
      >
        {theme.label}
        <div className={styles.circles}>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              /* eslint-disable-next-line react/no-array-index-key */
              <span key={index} className={styles.circle} aria-hidden="true" />
            ))}
        </div>
      </button>
    </li>
  );
}
