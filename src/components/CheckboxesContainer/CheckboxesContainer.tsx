import type { FC, ReactNode } from "react";
import { useTranslations } from "../../hooks/useTranslations";
import styles from "./CheckboxesContainer.module.scss";

type Props = {
  children: ReactNode;
};

export const CheckboxesContainer: FC<Props> = ({ children }) => {
  const translations = useTranslations();

  return (
    <div className={styles["checkbox-container"]}>
      {translations.checkboxHeading}

      {children}
    </div>
  );
};
