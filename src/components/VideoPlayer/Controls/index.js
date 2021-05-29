import React, { useState, useEffect } from "react";
import { BehaviorSubject, Subject } from "rxjs";
import { FocusManager, logger } from "../../../utils";
import styles from "./Controls.module.css";

export const isPaused$ = new BehaviorSubject(false);
export const progress$ = new Subject();
const wakeControls$ = new BehaviorSubject(true);

export function Controls() {
  const [isPaused, setIsPaused] = useState(false);
  const [isAwake, setIsAwake] = useState(true);
  const [progress, setProgress] = useState({
    duration: 0,
    currentTime: 0,
    secondsRemaining: 0,
    displayTime: "00:00",
  });

  useEffect(() => {
    const focusManager = new FocusManager();
    focusManager.getComponent("play-pause").focus();

    const isPausedSubscription = isPaused$.subscribe(setIsPaused);
    const wakeControlsSubscription = wakeControls$.subscribe(() => {
      setIsAwake(true);
      setTimeout(() => {
        setIsAwake(false);
      }, 7000);
    });
    const progressSubscription = progress$.subscribe((remainingTime) => {
      logger(remainingTime).log();
      setProgress(remainingTime);
    });

    return () => {
      isPausedSubscription.unsubscribe();
      wakeControlsSubscription.unsubscribe();
      progressSubscription.unsubscribe();
    };
  }, []);

  const { currentTime, duration } = progress;
  const progressWidth = currentTime / duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{ opacity: isAwake ? "1" : "0" }}
      className={styles["controls-dashboard"]}
      onKeyDown={() => wakeControls$.next()}
    >
      <div className={styles["progress-bar"]}>
        <div style={{ width: `${progressWidth}%` }} className={styles.progress}></div>
        <div className={styles["remaining-time"]}>{progress.displayTime}</div>
      </div>
      <div className={styles["controls-container"]}>
        <div className={styles["focus-container"]}>
          <div
            tabIndex="-1"
            data-component="play-pause"
            className={isPaused ? styles.play : styles.pause}
          ></div>
        </div>
      </div>
    </div>
  );
}
