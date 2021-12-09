import { Component, createRef } from "react";
import { path } from "ramda";
import { focusHandler$ } from "../GridsContainer";
import { cardFocusChange$ } from "../Hero";
import { dispatchShowPageEvent } from "../../Events";
import { DOM, isHighPerfDevice, logger } from "../../utils";

export class Card extends Component {
  constructor(props) {
    super(props);

    this.height = 0; //vw
    this.width = 0; //vw

    this.focusManagerProps = {
      onKeyDown: this.handleFocus,
      onFocus: this.handleHero,
    };

    this.state = { shouldMount: false };
    this.ref = createRef();
    this.isHighPerfDevice = isHighPerfDevice();

    this.handleFocus.bind(this);
    this.handleHero.bind(this);
  }

  handleMount = (event) => {
    const cardToMount = event.detail.cardToMount;
    const cardToUnmount = event.detail.cardToUnmount;
    if (this.ref.current === cardToMount) {
      this.setState({ shouldMount: true });
      logger({ card: cardToMount }, "mounted").log();
    }
    if (this.ref.current === cardToUnmount) {
      this.setState({ shouldMount: false });
      logger({ card: cardToUnmount }, "unmounted").log();
    }
  };

  componentDidMount() {
    if (this.isHighPerfDevice) {
      this.setState({ shouldMount: true });
    } else {
      const dom = new DOM();
      const isInRightViewport = dom.isInRightViewport(this.ref.current, 200);
      if (isInRightViewport) {
        this.setState({ shouldMount: true });
      }
      document.addEventListener("card-mount", this.handleMount);
    }
  }

  componentWillUnmount() {
    if (!this.isHighPerfDevice) {
      document.removeEventListener("card-mount", this.handleMount);
    }
  }

  handleFocus = (event) => {
    if (event.key === "Enter") {
      const id = path(["target", "id"], event);
      dispatchShowPageEvent(id);
    } else {
      focusHandler$.next(event);
    }
  };

  handleHero = () => {
    cardFocusChange$.next({ ...this.props });
  };
}
