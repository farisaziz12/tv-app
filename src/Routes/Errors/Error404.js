import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { FocusManager } from "../../utils";
import styles from "./Error.module.css";

export function Error404() {
  const history = useHistory();
  useEffect(() => {
    const focusManager = new FocusManager();
    const component = focusManager.getComponent("back-button").focus();
    const removeListener = component.listenFor(["Enter"], history.goBack);
    return () => {
      removeListener();
    };
  }, [history]);

  return (
    <div className={styles["error-container"]}>
      <div className={styles["error-404"]}>Error 404: Page Not Found</div>
      <div data-component="back-button" tabIndex="-1" className={styles["back-button"]}>
        Back
      </div>
    </div>
  );
}
