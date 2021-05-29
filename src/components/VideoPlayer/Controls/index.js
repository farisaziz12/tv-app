import React, { useState, useEffect } from "react";
import { pathOr } from "ramda";
import { BehaviorSubject, Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { ControlsButton } from "./ControlsButton";
import { FocusManager, logger } from "../../../utils";
import styles from "./Controls.module.css";

export const progress$ = new Subject();
export const playerControls$ = new Subject();
export const isPaused$ = new BehaviorSubject(false);
const wakeControls$ = new BehaviorSubject(true);
const wakeTime = 6000;

export function Controls() {
  const [isPaused, setIsPaused] = useState(false);
  const [isAwake, setIsAwake] = useState(true);
  const [progress, setProgress] = useState({
    duration: 0,
    currentTime: 0,
    displayTime: "00:00",
  });

  useEffect(() => {
    const focusManager = new FocusManager();
    focusManager.getComponent("play-pause-button").focus();

    const isPausedSubscription = isPaused$.subscribe(setIsPaused);
    const wakeControlsSubscription = wakeControls$
      .pipe(throttleTime(wakeTime))
      .subscribe(() => {
        setIsAwake(true);
        setTimeout(() => {
          setIsAwake(false);
        }, wakeTime);
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

  const handleControls = (event) => {
    wakeControls$.next();
    const component = pathOr("", ["target", "dataset", "component"], event);

    if (event.key === "Enter") {
      playerControls$.next(component);
    } else {
      const focusManager = new FocusManager(event);
      focusManager.playerControlFocus();
    }
  };

  const { currentTime, duration } = progress;
  const progressWidth = currentTime / duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{ opacity: isAwake ? "1" : "0" }}
      className={styles["controls-dashboard"]}
    >
      <div className={styles["progress-bar"]}>
        <div style={{ width: `${progressWidth}%` }} className={styles.progress}></div>
        <div className={styles["remaining-time"]}>{progress.displayTime}</div>
      </div>
      <div data-component="controls-container" className={styles["controls-container"]}>
        <ControlsButton
          className={styles["seek-button"]}
          component="back-button"
          handler={handleControls}
          text="15-"
        />
        <ControlsButton
          className={isPaused ? styles.play : styles.pause}
          component="play-pause-button"
          handler={handleControls}
        />
        <ControlsButton
          className={styles["seek-button"]}
          component="forward-button"
          handler={handleControls}
          text="15+"
        />
      </div>
    </div>
  );
}
