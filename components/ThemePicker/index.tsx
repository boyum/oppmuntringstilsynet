import React, { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import MessageContext from '../../contexts/MessageContext';
import { getActiveTheme, getTheme } from '../../pages/api/theme';
import { getTranslations } from '../../pages/api/translations';
import { Theme } from '../../types/Theme';
import { ThemePickerTheme } from '../ThemePickerTheme';
import styles from './ThemePicker.module.scss';

type Props = {
  isOpen: boolean;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
};

export function ThemePicker(props: Props): JSX.Element {
  const { isOpen, themes, setTheme } = props;

  const [, dispatchMessageAction] = useContext(MessageContext);
  const [language] = useContext(LanguageContext);
  const [className, setClassName] = useState(styles.themePicker);
  const [selectedTheme, setSelectedTheme] = useState<Theme>({} as Theme);

  const translations = getTranslations(language);

  useEffect(() => {
    setSelectedTheme(getActiveTheme(themes));
  }, []);

  useEffect(() => {
    setClassName(isOpen ? styles.themePicker : `${styles.themePicker} ${styles.themePickerOpen}`);
  }, [isOpen]);

  const onClick = (themeName: string) => {
    const newSelectedTheme = getTheme(themeName, themes);

    setSelectedTheme(newSelectedTheme);
    setTheme(newSelectedTheme);

    dispatchMessageAction({ type: 'setTheme', payload: themeName });
  };

  return (
    <div className={className}>
      <h2 className={styles.heading}>{translations.themePickerHeading}</h2>
      <ol hidden={!isOpen} className={styles.list}>
        {themes.map((theme) => (
          <ThemePickerTheme
            isSelected={selectedTheme.name === theme.name}
            onClick={onClick}
            theme={theme}
            key={theme.name}
          />
        ))}
      </ol>
    </div>
  );
}
