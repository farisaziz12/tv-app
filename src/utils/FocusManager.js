import { prop, propOr } from "ramda";
import { logger } from "./logger";
import { DOM } from "./DOM";
import {
  dispatchCardMountEvent,
  dispatchNoTargetEvent,
  dispatchKeyboardNoTargetEvent,
} from "../Events";
import { TYPES } from "../Types";

let lastCard;
export class FocusManager extends DOM {
  constructor(event) {
    super();
    this.event = event;
    this.isLeftKey = event?.key === TYPES.ARROW_LEFT;
    this.isRightKey = event?.key === TYPES.ARROW_RIGHT;
    this.isUpKey = event?.key === TYPES.ARROW_UP;
    this.isDownKey = event?.key === TYPES.ARROW_DOWN;
    this.containerGrids = this.getComponent("grids-container").childrenArray();
    this.currentGrid = this.getParent(prop("target", event), "grid");
    this.currentGridCards = this.getChildrenArray(this.currentGrid, "card");
    this.currentGridPosition = this.getElementPosition(
      this.containerGrids,
      this.currentGrid
    );
    this.currentCardPosition = this.getElementPosition(
      this.currentGridCards,
      event?.target
    );
  }

  initialGridFocus = () => {
    if (!this.containerGrids[0]) return false;
    const firstCard = prop(0, this.getChildrenArray(this.containerGrids[0]));

    if (firstCard) {
      firstCard.focus();
      return true;
    }
  };

  focusOnKeyboard = () => {
    const keyboard = this.getComponent("keyboard").component;
    if (!keyboard) return;

    if (!keyboard.contains(document.activeElement)) {
      this.getAllFocusableElements(keyboard).focusOnFirst();
    }
  };

  /**
   *  returns function (handler) that matches key
   * @param {String} key
   * @param {Object} handlers
   * @returns {Function}
   */
  getDirectionHandler = (key = "", handlers = {}) => {
    if (handlers[key]) {
      return handlers[key];
    } else {
      logger(`No Handler for ${key}`).warn();
    }
  };

  handleGridFocusDirection = () => {
    const { key } = this.event;

    const handlers = {
      ArrowRight: () => this.handleHorizontalFocus(true),
      ArrowLeft: () => this.handleHorizontalFocus(false),
      ArrowUp: () => this.handleVerticalFocus(true),
      ArrowDown: () => this.handleVerticalFocus(false),
    };

    const focusDirectionHandler = this.getDirectionHandler(key, handlers);

    if (focusDirectionHandler) focusDirectionHandler();
  };

  handleKeyboardFocusDirection = () => {
    const {
      element: key,
      index: keyIndex,
      parentElements: keyRowKeys,
      parentElement: keyRow,
    } = this.getElementProps(this.event.target);

    const { childrenArray: keyboardRows } = this.getComponent("keyboard");

    const currentRowIndex = keyboardRows().indexOf(keyRow);

    if (this.isRightKey || this.isLeftKey) {
      const nextKey = keyRowKeys[this.isRightKey ? keyIndex + 1 : keyIndex - 1];
      if (nextKey) {
        nextKey.focus();
      } else {
        dispatchKeyboardNoTargetEvent(this.event.key);
      }
    } else if (this.isUpKey || this.isDownKey) {
      const nextKeyRow =
        keyboardRows()[this.isDownKey ? currentRowIndex + 1 : currentRowIndex - 1];
      const nextRowKeys = this.getChildrenArray(nextKeyRow);

      if (nextRowKeys) {
        const currentKey = nextRowKeys[keyIndex] || nextRowKeys[nextRowKeys.length - 1];
        const nextKey =
          this.getClosestElementYAxis(key, currentKey, nextKeyRow, 200) ||
          this.findNextFocusableElement(nextRowKeys, keyIndex); // fallback

        if (nextKey) nextKey.focus();
      } else {
        dispatchKeyboardNoTargetEvent(this.event.key);
      }
    }
  };

  handleFocusLastElement = () => {
    const gridPosition = propOr(0, "gridPosition", lastCard);
    const grid = this.containerGrids[gridPosition];
    const card = prop(0, this.getChildrenArray(grid));

    if (card) {
      card.focus();
    } else {
      this.getAllFocusableElements().focusOnFirst();
    }
  };

  handleSidebarFocusDirection = () => {
    const { key } = this.event;
    const sidebarItem = this.event.target;
    const sidebarItems = this.getComponent("sidebar-items").childrenArray();
    const currentItemPosition = this.getElementPosition(sidebarItems, sidebarItem);

    const handleVerticalFocus = (isUp) => {
      const nextItemPosition = isUp ? currentItemPosition - 1 : currentItemPosition + 1;
      if (sidebarItems[nextItemPosition]) sidebarItems[nextItemPosition].focus();
    };

    const handlers = {
      ArrowRight: () => this.handleFocusLastElement(),
      ArrowUp: () => handleVerticalFocus(true),
      ArrowDown: () => handleVerticalFocus(false),
      Enter: () => {},
    };

    const focusDirectionHandler = this.getDirectionHandler(key, handlers);

    if (focusDirectionHandler) focusDirectionHandler();
  };

  /**
   * handles focusing on right or left card based on argument or sidebar
   * @param {Boolean} isRight
   */
  handleHorizontalFocus = (isRight) => {
    const { currentGridCards = [], currentCardPosition = 0 } = this;
    const nextIndex = isRight ? currentCardPosition + 1 : currentCardPosition - 1;
    const nextCard = currentGridCards[nextIndex];

    if (nextCard) {
      if (!this.isInViewport(nextCard)) {
        const card = this.currentGridCards[0];

        this.currentGrid.removeChild(card);
        this.currentGrid.appendChild(card);
        dispatchCardMountEvent(this.event);
      }
      nextCard.focus();
    } else {
      if (this.isLeftKey) {
        this.focusOnSidebar();
      }
    }
  };

  /**
   * handles focusing on up or down card based on argument
   * @param {Boolean} isUp
   */
  handleVerticalFocus = (isUp) => {
    const { containerGrids, currentGridPosition, currentCardPosition } = this;

    const nextIndex = isUp ? currentGridPosition - 1 : currentGridPosition + 1;
    const nextGrid = currentGridPosition === -1 ? undefined : containerGrids[nextIndex];

    if (nextGrid) {
      const nextGridCards = nextGrid.children;
      const nextFocusableCard = nextGridCards[currentCardPosition];
      const closestFocusableCard = this.getClosestElementYAxis(
        this.event.target,
        nextFocusableCard,
        nextGrid,
        350
      );

      const scrollGrid = (element) => {
        const hero = this.getComponent("hero").component;
        if (!hero) return;
        if (
          !this.isInViewport(element) ||
          this.isTouchingElement(this.event.target, hero)
        ) {
          this.handleVerticalScroll(isUp, element);
        }
      };

      if (closestFocusableCard && this.isInRightViewport(closestFocusableCard)) {
        scrollGrid(closestFocusableCard);
        closestFocusableCard.focus();
      } else {
        const element = this.findNextFocusableElement(
          nextGridCards,
          this.currentCardPosition
        );
        if (!element) return;
        scrollGrid(element);
      }
    } else {
      dispatchNoTargetEvent(this.event.key);
    }
  };

  /**
   * Adjusts margins for element horizontal position
   * @param {Boolean} shouldMoveLeft
   */
  handleHorizontalScroll = (shouldMoveLeft) => {
    const { width } = this.event.target.dataset;
    const { marginLeft } = this.currentGrid.style;
    const currentMargin = marginLeft
      ? parseFloat(propOr(0, 0, marginLeft.match(/-\d.+/g))) // get margin as integer without size units
      : 0;
    const cardWidth = parseFloat(width);

    this.currentGrid.style.marginLeft = shouldMoveLeft
      ? `${currentMargin + cardWidth}vw`
      : `${currentMargin - cardWidth}vw`;
  };

  /**
   * Adjusts margins for element vertical position
   * @param {Boolean} shouldMoveUp
   */
  handleVerticalScroll = (shouldMoveUp, nextElement) => {
    const height = shouldMoveUp
      ? nextElement.dataset.height
      : this.event.target.dataset.height;
    const gridsContainer = this.getComponent("grids-container").component;
    const { transform } = gridsContainer.style;
    const currentTranslate = transform
      ? parseFloat(propOr(0, 0, transform.match(/-\d.+/g))) // get translation distance as integer without units
      : 0;

    const cardHeight = parseFloat(height);

    gridsContainer.style.transform = shouldMoveUp
      ? `translateY(${currentTranslate + cardHeight}vw)`
      : `translateY(${currentTranslate - cardHeight}vw)`;

    logger(`Moved by ${height}vw`).log();
  };

  /**
   * Find first focusable card in the next grid
   * @param {Array} nextGridCards
   * @returns {HTMLElement}
   */
  findNextFocusableElement = (nextArrayOfElement, currentIndex) => {
    /* traverse the array of cards in reverse starting from current index
     * order to find the first focusable element
     */
    if (!currentIndex) return;
    for (let index = currentIndex; index !== 0; index -= 1) {
      const element = nextArrayOfElement[index];

      if (element && this.isInRightViewport(element)) {
        element.focus();
        return element;
      }
    }
  };

  focusOnSidebar = () => {
    const sidebarItems = this.getComponent("sidebar-items").childrenArray();
    const currentPath = window.location.pathname;
    const currentItem = sidebarItems.find((item) => item.pathname === currentPath);

    if (currentItem) {
      currentItem.focus();
    } else {
      sidebarItems[0].focus();
    }

    lastCard = { gridPosition: this.currentGridPosition };
  };

  playerControlFocus = () => {
    const controls = this.getComponent("controls-container").childrenArray();
    const currentPosition = this.getElementPosition(
      controls,
      this.event.target.parentElement
    );
    if (this.isRightKey) {
      const nextControl = controls[currentPosition + 1].firstElementChild;
      if (nextControl) nextControl.focus();
    } else if (this.isLeftKey) {
      const nextControl = controls[currentPosition - 1].firstElementChild;
      if (nextControl) nextControl.focus();
    }
  };
}
