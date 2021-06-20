import React, { useState, useRef } from "react";
import { TYPES } from "../../Types";
import { Keyboard } from "../Keyboard";
import { dispatchOnChangeEvent } from "../../Events";
import { FocusManager } from "../../utils";
import { Subject } from "rxjs";

export const onChange$ = new Subject();

export function Input({
  placeholder = "",
  className = "",
  component = "",
  onChange = () => {},
  onFocusOut = () => {},
  autofillSuggestions = [],
}) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const ref = useRef();

  const handleInput = (key, action) => {
    const input = ref.current;
    switch (action) {
      case TYPES.KEY_ACTION:
        dispatchOnChangeEvent(input, input.value + key);
        break;
      case TYPES.REPLACE_ACTION:
        dispatchOnChangeEvent(input, key);
        const focusManager = new FocusManager();
        focusManager.getComponent(component).focus();
        break;
      case TYPES.SPACE_ACTION:
        dispatchOnChangeEvent(input, input.value + " ");
        break;
      case TYPES.DELETE_ACTION:
        dispatchOnChangeEvent(input, input.value.substr(0, input.value.length - 1));
        break;

      default:
        break;
    }
  };

  const handleExitInput = (shouldFocusOnSidebar = false) => {
    const isFocusedOut = onFocusOut();
    if (isFocusedOut) {
      setShouldShowKeyboard(false);
    } else if (shouldFocusOnSidebar) {
      const focusManager = new FocusManager();
      focusManager.focusOnSidebar();
      setShouldShowKeyboard(false);
    }
  };

  const renderKeyboard = () => {
    const noTargetConfig = {
      ArrowUp: handleExitInput,
      Backspace: () => handleExitInput(true),
      ArrowLeft: () => handleExitInput(true),
      Enter: () => handleExitInput(true),
    };

    if (showKeyboard) {
      return (
        <Keyboard
          autofillSuggestions={autofillSuggestions}
          noTarget={noTargetConfig}
          handleInput={handleInput}
        />
      );
    }
  };

  const setShouldShowKeyboard = (shouldShow) => {
    setShowKeyboard(shouldShow);
  };

  const handleOnChange = (event) => {
    onChange$.next(event.target.value);
    onChange(event);
  };

  const focusOnKeyboard = () => {
    setShouldShowKeyboard(true);

    // TODO: make this into focus manager method
    const focusManager = new FocusManager();
    const keyboard = focusManager.getComponent("keyboard").component;
    focusManager.getAllFocusableElements(keyboard).focusOnFirst();
  };

  return (
    <div>
      <input
        ref={ref}
        onChange={handleOnChange}
        data-component={component}
        onFocus={focusOnKeyboard}
        className={className}
        placeholder={placeholder}
        type="text"
      />
      {renderKeyboard()}
    </div>
  );
}
