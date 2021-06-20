import { keyHandler$ } from "../";
import styles from "./Key.module.css";

export function Key({ lowercase, uppercase, action, isUppercase }) {
  const key = isUppercase ? uppercase : lowercase;

  const handleKeyDown = (event) => {
    keyHandler$.next({ event, action, key });
  };
  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex="-1"
      data-component="key"
      className={styles.key}
    >
      {key}
    </div>
  );
}
