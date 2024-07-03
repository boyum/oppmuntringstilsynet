import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  return (
    <footer className={styles["footer"]}>
      <a href="https://github.com/boyum/oppmuntringstilsynet">GitHub</a>
    </footer>
  );
};
