import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { isEmpty, prop } from "ramda";
import { KeyRow } from "./KeyRow";
import { keys } from "./Keys";
import { FocusManager, keyHandler, logger } from "../../utils";
import { TYPES } from "../../Types";
import { onChange$ } from "../Input";
import styles from "./Keyboard.module.css";

export const keyHandler$ = new Subject();

export function Keyboard({ noTarget = {}, handleInput, autofillSuggestions }) {
  const [isUppercase, setIsUppercase] = useState(false);

  useEffect(() => {
    const focusManager = new FocusManager();
    const keyboard = focusManager.getComponent("keyboard").component;
    if (!keyboard.contains(document.activeElement)) {
      focusManager.getAllFocusableElements(keyboard).focusOnFirst();
    }

    const keyHandlerSubscription = keyHandler$.subscribe(({ event, action, key }) => {
      if (event.key === TYPES.ENTER_KEY) {
        switch (action) {
          case TYPES.SHIFT_ACTION:
            setIsUppercase((prevState) => !prevState);
            break;
          case TYPES.ENTER_ACTION:
            noTargetFunc(event);
            break;

          default:
            handleInput(key, action);
            break;
        }
      } else if (event.key === TYPES.BACKSPACE_KEY) {
        noTargetFunc(event);
      } else {
        const focusManager = new FocusManager(event);
        focusManager.handleKeyboardFocusDirection();
      }
    });

    const onChangeSubscription = onChange$.subscribe((value) => {});

    document.addEventListener("keyboard-no-nav-target", noTargetFunc);

    return () => {
      keyHandlerSubscription.unsubscribe();
      onChangeSubscription.unsubscribe();
      document.removeEventListener("keyboard-no-nav-target", noTargetFunc);
    };
  }, [autofillSuggestions]);

  const noTargetFunc = (event) => {
    const syntheticEvent = prop("detail", event);
    const eventData = syntheticEvent || { key: event.key };

    if (isEmpty(noTarget)) {
      logger("No target").warn();
    } else {
      keyHandler(eventData, noTarget);
    }
  };

  const renderKeyRows = () => {
    const renderAutoFillSuggestions = () => {
      if (autofillSuggestions[0]) {
        const suggestions = autofillSuggestions.map((suggestion) => ({
          uppercase: suggestion.title,
          lowercase: suggestion.title,
          action: TYPES.REPLACE_ACTION,
        }));

        return (
          <KeyRow isUppercase={isUppercase} key={Math.random() * 10} keys={suggestions} />
        );
      }
    };

    return (
      <div data-component="keyboard" className={styles.rows}>
        {renderAutoFillSuggestions()}
        {keys.map((keyRow, index) => (
          <KeyRow isUppercase={isUppercase} key={index} keys={keyRow} />
        ))}
      </div>
    );
  };

  return <div className={styles["keyboard-container"]}>{renderKeyRows()}</div>;
}
