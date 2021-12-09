import { path, prop } from "ramda";
import { logger } from "./logger";
export class DOM {
  /** get DOM HTML Component and return function to get array of children
   * @param {String} componentName
   * @return {Object}
   */
  getComponent = (componentName) => {
    const component = document.querySelector(`[data-component=${componentName}]`);

    /** @return {Array} */
    const childrenArray = () => {
      if (!component) return [];
      return Array.from(component.children);
    };

    const focusOnFirstChild = () => {
      const children = childrenArray();
      if (children[0]) children[0].focus();
    };

    /**
     * focuses on component and returns listener function
     * @returns {Function}
     */
    const focus = () => {
      if (!component) return;
      component.focus();
      /**
       * calls function based on accepted keys
       * @param {Array} keys
       * @param {Function} callback
       * @returns {Function}
       */
      component.listenFor = function (keys = [], callback) {
        if (!keys[0] || !callback) return;
        const checkKeysAndCall = (event) => {
          if (keys.includes(event.key)) {
            callback(event);
          } else {
            logger(`No Handler for ${event.key}`).warn();
          }
        };
        this.addEventListener("keydown", checkKeysAndCall);
        const remove = () => this.removeEventListener("keydown", checkKeysAndCall);

        /**
         * Returns keys that are being listened for
         * @returns {Array}
         */
        component.keyListeners = function () {
          return keys;
        };

        return remove;
      };
      return component;
    };
    return { component, childrenArray, focus, focusOnFirstChild };
  };

  /**
   * checks if current event component matches argument component
   * @event event
   * @param {HTMLElement} component
   * @returns {Boolean}
   */
  isCurrentComponent = (event, component) => {
    const eventComponent = path(["target", "dataset", "component"], event);
    return eventComponent === component;
  };

  /**
   * get array of element children. Can filter by component
   * @param {HTMLElement} element
   * @param {String} component
   * @returns {Array}
   */
  getChildrenArray = (element, component) => {
    if (!element) return;

    if (component) {
      return Array.from(element.children).filter(
        (child) => child.dataset.component === component
      );
    } else {
      return Array.from(element.children);
    }
  };

  /**
   * Get position of current element in array of elements
   * @param {Array} elementsArray
   * @param {HTMLElement} element
   * @returns {Integer}
   */
  getElementPosition = (elementsArray, element) => {
    if (!elementsArray) return;
    const position = elementsArray.indexOf(element);
    return position;
  };

  /**
   * Check if is in viewport
   * @param {HTMLElement} element
   * @returns {Boolean}
   */
  isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  /**
   * Check if is in the right section of the viewport
   * @param {HTMLElement} element
   * @param {Integer} threshold
   * @returns {Boolean}
   */
  isInRightViewport = (element, threshold = 0) => {
    const rightRect = element.getBoundingClientRect().right;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    return rightRect <= windowWidth + threshold;
  };

  /**
   * Check if two elements are colliding
   * @param {HTMLElement} currentElement
   * @param {HTMLElement} targetElement
   * @returns {Boolean}
   */
  isTouchingElement = (currentElement, targetElement) => {
    const currentElementDistanceFromTop =
      currentElement.offsetTop + currentElement.height;
    const currentElementDistanceFromLeft =
      currentElement.offsetLeft + currentElement.width;

    const targetElementDistanceFromTop = targetElement.offsetTop + targetElement.height;
    const targetElementDistanceFromLeft = currentElement.offsetLeft + targetElement.width;

    const notColliding =
      currentElementDistanceFromTop < targetElement.offsetTop ||
      currentElement.offsetTop > targetElementDistanceFromTop ||
      currentElementDistanceFromLeft < currentElement.offsetLeft ||
      currentElement.offsetLeft > targetElementDistanceFromLeft;

    // Return whether it Is colliding
    return !notColliding;
  };

  /**
   * get element parents and if component will only return if matches
   * @param {HTMLElement} element
   * @param {String} component
   * @returns {HTMLElement}
   */
  getParent = (element, component) => {
    const parent = prop("parentElement", element);
    if (component) {
      if (path(["dataset", "component"], parent) === component) return parent;
    } else {
      return parent;
    }
  };

  /**
   * gets the distance between two elements
   * @param {HTMLElement} elementOne
   * @param {HTMLElement} elementTwo
   * @returns {Integer}
   */
  getDistanceBetweenElements = (elementOne, elementTwo) => {
    if (!elementOne || !elementTwo) return;
    const elementOneRect = elementOne.getBoundingClientRect();
    const elementTwoRect = elementTwo.getBoundingClientRect();
    // get element 1 center point
    const elementOneX = elementOneRect.left + elementOneRect.width / 2;
    const elementOneY = elementOneRect.top + elementOneRect.height / 2;
    // get element 2 center point
    const elementTwoX = elementTwoRect.left + elementTwoRect.width / 2;
    const elementTwoY = elementTwoRect.top + elementTwoRect.height / 2;

    const distanceSquared =
      Math.pow(elementOneX - elementTwoX, 2) + Math.pow(elementOneY - elementTwoY, 2);
    const distance = Math.sqrt(distanceSquared);

    return distance;
  };

  /**
   *  checks if element component matches component argument
   * @param {HTMLElement} element
   * @param {String} component
   * @returns {Boolean}
   */
  isElementComponent = (element, component) => {
    const elementComponent = path(["dataset", "component"], element);

    return elementComponent === component;
  };

  /**
   *
   * @param {HTMLElement} element
   * @returns {Object}
   */
  getElementProps = (element) => {
    const parentElement = element.parentElement;
    const parentElements = this.getChildrenArray(parentElement);
    const index = parentElements.indexOf(element) || 0;

    return { index, parentElements, element, parentElement };
  };

  /**
   * gets all focusable elements on screen
   * @returns {Object}
   */
  getAllFocusableElements = (element) => {
    const scope = element || document;
    const elements = Array.from(scope.querySelectorAll('[tabindex = "-1"], input'));

    const focusOnFirst = () => {
      if (elements[0]) elements[0].focus();
    };

    return { elements, focusOnFirst };
  };

  /**
   * returns the closest card in the next grid relative to the current card
   * @param {HTMLElement} currentElement
   * @param {HTMLElement} nextElement
   * @param {HTMLElement} nextContainer
   * @param {Integer} threshold
   * @returns {HTMLElement}
   */
  getClosestElementYAxis = (
    currentElement,
    nextElement,
    nextContainer,
    threshold = 250
  ) => {
    const nextContainerChildren = this.getChildrenArray(nextContainer);
    const nextElementPosition = this.getElementPosition(
      nextContainerChildren,
      nextElement
    );
    const currentDistance = this.getDistanceBetweenElements(currentElement, nextElement);

    const findClosestElement = (shouldSearchRight, currentEl, currentDistance) => {
      let distance = currentDistance;
      const currentElementPosition = this.getElementPosition(
        nextContainerChildren,
        currentEl
      );
      let element;
      let elementPosition = currentElementPosition;
      while (distance > threshold) {
        const nextPosition = shouldSearchRight
          ? elementPosition + 1
          : elementPosition - 1;
        element = nextContainerChildren[nextPosition];
        distance = this.getDistanceBetweenElements(currentElement, element);
        elementPosition = nextPosition;

        if (distance < threshold) {
          if (this.isInRightViewport(element)) {
            return element;
          } else {
            return nextContainerChildren[nextPosition - 1];
          }
        }
      }

      return currentEl;
    };

    const prevIndexElement = nextContainerChildren[nextElementPosition - 1];
    const prevIndexElementDistance = prevIndexElement
      ? this.getDistanceBetweenElements(currentElement, prevIndexElement)
      : undefined;
    const nextIndexElement = nextContainerChildren[nextElementPosition + 1];
    const nextIndexElementDistance = nextIndexElement
      ? this.getDistanceBetweenElements(currentElement, nextIndexElement)
      : undefined;

    if (prevIndexElement && prevIndexElementDistance < currentDistance) {
      return findClosestElement(false, prevIndexElement, prevIndexElementDistance);
    } else if (nextIndexElement && nextIndexElementDistance < currentDistance) {
      return findClosestElement(true, nextIndexElement, nextIndexElementDistance);
    } else {
      return nextElement;
    }
  };
}
