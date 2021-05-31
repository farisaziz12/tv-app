import React, { useEffect, useState } from "react";
import { pathOr } from "ramda";
import { useHistory } from "react-router";
import { offlineCheck$ } from "../../BootstrapFunctions";
import styles from "./Error.module.css";

export function NetworkError() {
  const [checkCount, setCheckCount] = useState(5);
  const history = useHistory();

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const isOnline = pathOr(false, ["navigator", "onLine"], window);
      if (isOnline) {
        history.goBack();
        offlineCheck$.next(false);
      }
    }, 5000);

    const countInterval = setInterval(() => {
      setCheckCount((prevState) => {
        if (prevState === 1) {
          return 5;
        } else {
          return (prevState -= 1);
        }
      });
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(countInterval);
    };
  }, [history]);

  return (
    <div className={styles["error-container"]}>
      <div className={styles["error-text"]}>You are not connected to the internet</div>
      <div className={styles["error-text"]}>Attempting to Reconnect in:</div>
      <div>{checkCount}</div>
    </div>
  );
}
