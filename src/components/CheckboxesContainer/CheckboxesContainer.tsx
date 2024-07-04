import type { FC, ReactNode } from "react";
import styles from "./CheckboxesContainer.module.scss";
import { useTranslations } from "../../hooks/useTranslations";

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
