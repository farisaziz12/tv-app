import React from "react";
import styles from "./Loader.module.css";

export function Loader({ top, right }) {
  const styleObj = top || right ? { top: `${top}vw`, right: `${right}vw` } : {};

  return <div style={styleObj} className={styles.loader}></div>;
}
