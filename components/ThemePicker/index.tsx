import React, { useEffect, useState } from 'react';
import { getActiveTheme, getTheme } from '../../pages/api/theme';
import { Theme } from '../../types/Theme';
import { ThemePickerTheme } from '../ThemePickerTheme';
import styles from './ThemePicker.module.css';

type Props = {
  isOpen: boolean;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
};

export function ThemePicker(props: Props): JSX.Element {
  const { isOpen, themes, setTheme } = props;
  const [className, setClassName] = useState(styles.themePicker);
  const [selectedTheme, setSelectedTheme] = useState(getActiveTheme(themes));

  useEffect(() => {
    setClassName(isOpen ? styles.themePicker : `${styles.themePicker} ${styles.themePickerOpen}`)
  }, [isOpen]);

  const onClick = (themeName: string) => {
    const newSelectedTheme = getTheme(themeName, themes);

    setSelectedTheme(newSelectedTheme);
    setTheme(newSelectedTheme);
  };

  return (
    <ol hidden={!isOpen} className={className}>
      {themes.map((theme) => (
        <ThemePickerTheme
          isSelected={selectedTheme.name === theme.name}
          onClick={onClick}
          theme={theme}
          key={theme.name}
        />
      ))}
    </ol>
  );
}
