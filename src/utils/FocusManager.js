import { pathOr, prop, propOr } from "ramda";
import { DOM } from "./DOM";
import { logger } from "./logger";

let lastCard;
export class FocusManager extends DOM {
  constructor(event) {
    super();
    this.event = event;
    this.containerGrids = this.getComponent("grids-container").childrenArray();
    this.currentGrid = this.getParent(prop("target", event), "grid");
    this.currentGridCards = this.getChildrenArray(this.currentGrid, "basic-card");
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
    if (!this.containerGrids[0]) return;
    const firstCard = prop(0, this.getChildrenArray(this.containerGrids[0]));

    if (firstCard) firstCard.focus();
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

  handleSidebarFocusDirection = () => {
    const { key } = this.event;
    const sidebarItem = this.event.target;
    const sidebarItems = this.getComponent("sidebar-items").childrenArray();
    const currentItemPosition = this.getElementPosition(sidebarItems, sidebarItem);

    const handleVerticalFocus = (isUp) => {
      const nextItemPosition = isUp ? currentItemPosition - 1 : currentItemPosition + 1;
      if (sidebarItems[nextItemPosition]) sidebarItems[nextItemPosition].focus();
    };

    const handleFocusLastCard = () => {
      if (lastCard) lastCard.focus();
    };

    const handlers = {
      ArrowRight: () => handleFocusLastCard(),
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
        this.handleHorizontalScroll(!isRight);
      }
      nextCard.focus();
    } else {
      this.focusOnSidebar();
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
      let nextGridCardPositionDiff = parseInt(
        pathOr("0", ["dataset", "positionDiff"], nextGrid)
      );
      nextGridCardPositionDiff = isUp ? nextGridCardPositionDiff : 0;
      const nextFocusableCard =
        nextGridCards[currentCardPosition + nextGridCardPositionDiff];

      const scrollGrid = (element) => {
        if (
          !this.isInViewport(element) ||
          this.isTouchingElement(this.event.target, this.getComponent("hero").component)
        ) {
          this.handleVerticalScroll(isUp);
        }
      };

      if (nextFocusableCard && this.isInRightViewport(nextFocusableCard)) {
        nextGrid.setAttribute("data-position-diff", 0);
        scrollGrid(nextFocusableCard);
        nextFocusableCard.focus();
      } else {
        const element = this.findNextFocusableCard(nextGridCards);
        if (!element) return;
        scrollGrid(element);
      }
    } else {
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
      ? parseInt(propOr(0, 0, marginLeft.match(/-\d.+/g))) // get margin as integer without size units
      : 0;
    const cardWidth = parseInt(width);

    this.currentGrid.style.marginLeft = shouldMoveLeft
      ? `${currentMargin + cardWidth}vw`
      : `${currentMargin - cardWidth}vw`;
  };

  /**
   * Adjusts margins for element vertical position
   * @param {Boolean} shouldMoveUp
   */
  handleVerticalScroll = (shouldMoveUp) => {
    const { currentGrid } = this;
    const { height } = this.event.target.dataset;
    const gridContainer = currentGrid.parentElement;
    const { marginTop } = gridContainer.style;
    const currentMargin = marginTop
      ? parseInt(propOr(0, 0, marginTop.match(/-\d.+/g))) // get margin as integer without size units
      : 0;
    const cardHeight = parseInt(height);
    gridContainer.style.marginTop = shouldMoveUp
      ? `${currentMargin + cardHeight}vw`
      : `${currentMargin - cardHeight}vw`;
  };

  /**
   * Find first focusable card in the next grid
   * @param {Array} nextGridCards
   * @returns {HTMLElement}
   */
  findNextFocusableCard = (nextGridCards) => {
    const { currentCardPosition } = this;
    /* traverse the array of cards in reverse starting from current card position
     * order to find the first focusable card
     */
    if (!currentCardPosition) return;
    for (let index = currentCardPosition; index !== 0; index -= 1) {
      const element = nextGridCards[index];

      if (element && this.isInRightViewport(element)) {
        this.currentGrid.setAttribute("data-position-diff", currentCardPosition - index);
        element.focus();
        return element;
      }
    }
  };

  focusOnSidebar = () => {
    if (this.currentCardPosition === 0) {
      this.getComponent("sidebar-items").focusOnFirstChild();
      lastCard = this.event.target;
    }
  };
}
