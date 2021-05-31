import { pathOr } from "ramda";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { FocusManager } from "../../utils";
import styles from "./Error.module.css";

export function Error404({ location }) {
  const history = useHistory();
  useEffect(() => {
    const isFailure = pathOr(false, ["state", "failure"], location);
    const focusManager = new FocusManager();
    const component = focusManager.getComponent("back-button").focus();
    const removeListener = component.listenFor(["Enter"], () => {
      if (isFailure) {
        history.go(-2);
      } else {
        history.goBack();
      }
    });
    return () => {
      removeListener();
    };
  }, [history]);

  return (
    <div className={styles["error-container"]}>
      <div className={styles["error-text"]}>Error 404: Page Not Found</div>
      <div data-component="back-button" tabIndex="-1" className={styles["back-button"]}>
        Back
      </div>
    </div>
  );
}
