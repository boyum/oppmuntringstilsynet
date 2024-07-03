import type { Theme } from "../../types/Theme";
import type { ThemeName } from "../../types/ThemeName";
import styles from "./ThemePickerTheme.module.scss";

type Props = {
  theme: Theme;
  isSelected: boolean;
  onClick: (themeName: ThemeName) => void;
};

export const ThemePickerTheme: React.FC<Props> = ({
  theme,
  isSelected,
  onClick,
}) => {
  const classNames = [isSelected ? styles["is-selected"] : ""].join(" ");

  return (
    <li className={classNames} data-theme={theme.name}>
      <button
        id={`theme-${theme.name}`}
        className={styles["button"]}
        type="button"
        onClick={() => onClick(theme.name)}
      >
        {theme.label}
        <div className={styles["circles"]}>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: We use the index as a key because the array is static
                key={index}
                className={styles["circle"]}
                aria-hidden="true"
              />
            ))}
        </div>
      </button>
    </li>
  );
};
