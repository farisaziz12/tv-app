import React from "react";
import styles from "../Controls.module.css";

export function ControlsButton({ component, className, handler, text = "" }) {
  return (
    <div className={styles["focus-container"]}>
      <div
        tabIndex="-1"
        data-component={component}
        className={className}
        onKeyDown={handler}
      >
        {text}
      </div>
    </div>
  );
}
