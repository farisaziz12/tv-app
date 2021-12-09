import { pathOr } from "ramda";
import { logger, convertBooleanString } from "../utils";

export class FocusContainer extends HTMLElement {
  connectedCallback() {
    const component = pathOr("", ["attributes", "component", "value"], this);
    const height = pathOr("0", ["attributes", "height", "value"], this);
    const width = pathOr("0", ["attributes", "width", "value"], this);
    const id = pathOr("0", ["attributes", "id", "value"], this);
    const className = pathOr("", ["attributes", "className", "value"], this);
    const keys = pathOr([], ["attributes", "keys", "value"], this);
    const autoAriaLabel = convertBooleanString(
      pathOr(false, ["attributes", "auto-aria-label", "value"], this)
    );

    this.height = parseFloat(height);
    this.width = parseFloat(width);
    this.id = parseFloat(id);
    this.component = component;
    this.className = className;
    this.tabIndex = "-1";

    if (component) this.dataset.component = component;

    if (autoAriaLabel) {
      this.generateAriaLabel();
    }

    if (keys[0]) {
      this.keys = keys.split(",");
    }
  }

  generateAriaLabel() {
    this.ariaLabel = this.innerText.split("\n").join(", ");
  }

  childrenArray() {
    return Array.from(this.children);
  }

  focusOnFirstChild() {
    const children = this.childrenArray();
    if (children[0]) children[0].focus();
  }

  listenFor(callback) {
    if (!this.keys[0] || !callback) return;

    const checkKeysAndCall = (event) => {
      if (this.keys.includes(event.key)) {
        callback(event);
      } else {
        logger(`No Handler for ${event.key}`).warn();
      }
    };
    this.addEventListener("keydown", checkKeysAndCall);
    const remove = () => this.removeEventListener("keydown", checkKeysAndCall);

    return remove;
  }
}

window.customElements.define("focus-container", FocusContainer);
