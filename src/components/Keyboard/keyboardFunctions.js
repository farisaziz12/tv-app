import { isEmpty, prop } from "ramda";
import { TYPES } from "../../Types";
import { FocusManager, keyHandler, logger } from "../../utils";

export const actionHandler = ({
  event,
  action,
  key,
  setIsUppercase,
  handleInput,
  noTarget,
}) => {
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
    noTargetFunc(event, noTarget);
  } else {
    const focusManager = new FocusManager(event);
    focusManager.handleKeyboardFocusDirection();
  }
};

export const noTargetFunc = (event, noTarget = {}) => {
  console.log(event, noTarget);
  const syntheticEvent = prop("detail", event);
  const eventData = syntheticEvent || { key: event.key };

  if (isEmpty(noTarget)) {
    logger("No target").warn();
  } else {
    keyHandler(eventData, noTarget);
  }
};
