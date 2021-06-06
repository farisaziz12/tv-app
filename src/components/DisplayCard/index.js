import React, { Component, createRef } from "react";
import { path, prop } from "ramda";
import { focusHandler$ } from "../GridsContainer";
import { dispatchShowPageEvent } from "../../Events";
import { cardFocusChange$ } from "../Hero";
import { DOM, isHighPerfDevice, logger } from "../../utils";
import styles from "./DisplayCard.module.css";

export class DisplayCard extends Component {
  constructor(props) {
    super(props);
    this.height = 13.5; //vw
    this.width = 18.485; //vw

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
    if (!this.isHighSpecDevice) {
      document.removeEventListener("card-mount", this.handleMount);
    }
  }

  handleFocus = (event) => {
    if (event.key === "Enter") {
      const id = path(["target", "dataset", "id"], event);
      dispatchShowPageEvent(id);
    } else {
      focusHandler$.next(event);
    }
  };
  handleHero = () => {
    cardFocusChange$.next({ ...this.props });
  };

  renderTitle = () => {
    const { title } = this.props;
    return <div className={styles["display-card-title"]}>{title}</div>;
  };

  renderGenre = () => {
    const { genres } = this.props;
    const genre = prop(0, genres);

    if (genre) {
      return <div className={styles["display-card-genre"]}>{genre}</div>;
    }
  };

  render() {
    const { title, backdropUrl, id } = this.props;
    const { shouldMount } = this.state;
    return (
      <div
        className={styles["display-card-container"]}
        data-component="card"
        data-id={id}
        tabIndex="-1"
        data-height={this.height}
        data-width={this.width}
        onKeyDown={this.handleFocus}
        aria-label={title}
        onFocus={this.handleHero}
        ref={this.ref}
      >
        <div
          style={{ backgroundImage: `url(${shouldMount ? backdropUrl : ""})` }}
          className={styles["display-card"]}
        ></div>
        {this.renderTitle()}
        {this.renderGenre()}
      </div>
    );
  }
}
