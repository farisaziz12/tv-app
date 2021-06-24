import React, { createRef, Component } from "react";
import { TYPES } from "../../Types";
import { Keyboard } from "../Keyboard";
import { dispatchOnChangeEvent } from "../../Events";
import { FocusManager } from "../../utils";
import { Subject } from "rxjs";

export const onChange$ = new Subject();

export class Input extends Component {
  constructor(props) {
    super(props);

    const {
      placeholder = "",
      className = "",
      component = "",
      onChange = () => {},
      onFocusOut = () => {},
    } = props;

    this.placeholder = placeholder;
    this.className = className;
    this.component = component;
    this.onChange = onChange;
    this.onFocusOut = onFocusOut;

    this.state = {
      shouldShowKeyboard: false,
    };

    this.ref = createRef();
  }

  handleInput = (key, action) => {
    const { component, ref } = this;

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

  handleExitInput = (shouldFocusOnSidebar = false) => {
    const isFocusedOut = this.onFocusOut();
    if (isFocusedOut) {
      this.setState({ shouldShowKeyboard: false });
    } else if (shouldFocusOnSidebar) {
      const focusManager = new FocusManager();
      focusManager.focusOnSidebar();
      this.setState({ shouldShowKeyboard: false });
    }
  };

  renderKeyboard = () => {
    const noTargetConfig = {
      ArrowUp: this.handleExitInput,
      Backspace: () => this.handleExitInput(true),
      ArrowLeft: () => this.handleExitInput(true),
      Enter: () => this.handleExitInput(true),
    };

    if (this.state.shouldShowKeyboard) {
      return (
        <Keyboard
          autofillSuggestions={this.props.autofillSuggestions}
          noTarget={noTargetConfig}
          handleInput={this.handleInput}
        />
      );
    }
  };

  setShouldShowKeyboard = (shouldShowKeyboard) => {
    this.setState({ shouldShowKeyboard });
  };

  handleOnChange = (event) => {
    onChange$.next(event.target.value);
    this.onChange(event);
  };

  focusOnKeyboard = () => {
    this.setShouldShowKeyboard(true);

    const focusManager = new FocusManager();
    focusManager.focusOnKeyboard();
  };

  render() {
    const { ref, handleOnChange, component, focusOnKeyboard, className, placeholder } =
      this;
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
        {this.renderKeyboard()}
      </div>
    );
  }
}
