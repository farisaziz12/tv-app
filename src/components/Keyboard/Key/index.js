import { keyHandler$ } from "../";
import styles from "./Key.module.css";

export function Key({ lowercase, uppercase, action, isUppercase }) {
  const key = isUppercase ? uppercase : lowercase;

  const handleKeyDown = (event) => {
    keyHandler$.next({ event, action, key });
  };
  return (
    <focus-container onKeyDown={handleKeyDown} component="key" className={styles.key}>
      {key}
    </focus-container>
  );
}
