import { Key } from "../Key";
import styles from "./KeyRow.module.css";

export function KeyRow({ keys, isUppercase }) {
  const renderKeys = () => {
    return keys.map((key) => (
      <Key isUppercase={isUppercase} key={key.lowercase} {...key} />
    ));
  };
  return <div className={styles["key-row"]}>{renderKeys()}</div>;
}
