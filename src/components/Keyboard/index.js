import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { KeyRow } from "./KeyRow";
import { keys } from "./Keys";
import { FocusManager } from "../../utils";
import { TYPES } from "../../Types";
import { onChange$ } from "../Input";
import { actionHandler, noTargetFunc } from "./keyboardFunctions";
import styles from "./Keyboard.module.css";

export const keyHandler$ = new Subject();

export function Keyboard({ noTarget = {}, handleInput, autofillSuggestions }) {
  const [isUppercase, setIsUppercase] = useState(false);

  useEffect(() => {
    const focusManager = new FocusManager();
    focusManager.focusOnKeyboard();

    const keyHandlerSubscription = keyHandler$.subscribe(({ event, action, key }) => {
      actionHandler({ event, action, key, setIsUppercase, handleInput, noTarget });
    });

    const onChangeSubscription = onChange$.subscribe((value) => {});

    document.addEventListener("keyboard-no-nav-target", (event) =>
      noTargetFunc(event, noTarget)
    );

    return () => {
      keyHandlerSubscription.unsubscribe();
      onChangeSubscription.unsubscribe();
      document.removeEventListener("keyboard-no-nav-target", (event) =>
        noTargetFunc(event, noTarget)
      );
    };
  }, [autofillSuggestions]);

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
