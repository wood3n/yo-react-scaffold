import React from "react";
import styles from "./style.less";

interface Props {
  onClick: () => void;
}

const Button: React.FC<Props> = ({ onClick, children }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
