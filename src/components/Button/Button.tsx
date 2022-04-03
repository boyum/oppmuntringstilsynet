import styles from "./Button.module.scss";

export type ButtonProps = {
  id: string;
  onClick: React.MouseEventHandler;
  labelText: string;
};

export const Button: React.FC<ButtonProps> = ({ id, onClick, labelText }) => (
  <button type="button" id={id} className={styles["button"]} onClick={onClick}>
    <div className={styles["button-inner"]}>{labelText}</div>
  </button>
);
