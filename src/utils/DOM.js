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
      if (!component) return;
      return Array.from(component.children);
    };

    const focusOnFirstChild = () => {
      const children = childrenArray();
      children[0] && children[0].focus();
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
      const listenFor = (keys = [], callback) => {
        if (!keys[0] || !callback) return;
        const checkKeysAndCall = (event) => {
          if (keys.includes(event.key)) {
            callback(event);
          } else {
            logger(`No Handler for ${event.key}`).warn();
          }
        };
        component.addEventListener("keydown", checkKeysAndCall);
        const remove = () => component.removeEventListener("keydown", checkKeysAndCall);
        return remove;
      };
      return { listenFor };
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
  getElementPosition = (elementsArray, element = 0) => {
    if (!elementsArray) return;

    const position = elementsArray.indexOf(element);
    return position;
  };

  /**
   * Check if is in viewport
   * @param {Object} rect
   * @returns {Boolean}
   */
  isInViewport = (rect) => {
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
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
   *  checks if element component matches component argument
   * @param {HTMLElement} element
   * @param {String} component
   * @returns {Boolean}
   */
  isElementComponent = (element, component) => {
    const elementComponent = path(["dataset", "component"], element);

    return elementComponent === component;
  };
}
