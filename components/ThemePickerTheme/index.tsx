import React from 'react';
import { Theme } from '../../types/Theme';
import styles from './ThemePickerTheme.module.css'

type Props = {
  theme: Theme;
  isSelected: boolean;
  onClick: (themeName: string) => void;
};

export function ThemePickerTheme(props: Props): JSX.Element {
  const { theme, isSelected, onClick } = props;

  return (
    <li className={`${styles.theme} ${isSelected && styles.isSelected} ${theme.name}`}>
      <button
        className={styles.button}
        type="button"
        onClick={() => onClick(theme.name)}
      >
        {theme.label}
      </button>
    </li>
  );
}
