import React, { Component } from "react";
import { Subject } from "rxjs";
import { auditTime } from "rxjs/operators";
import { getImages } from "../../API";
import { FocusManager } from "../../utils";
import { cardFocusChange$ } from "../Hero";
import styles from "./BasicCard.module.css";

export class BasicCard extends Component {
  constructor() {
    super();
    this.height = 18; //vw
    this.width = 11; //vw
    this.focusHandler$ = new Subject();

    this.state = {
      images: {},
    };

    this.focusHandler$.pipe(auditTime(100)).subscribe((event) => {
      const focusManager = new FocusManager(event);
      focusManager.handleGridFocusDirection();
    });
  }

  componentDidMount() {
    (async () => {
      const images = getImages(this.props);
      this.setState({ images });
    })();
  }

  handleFocus = (event) => {
    this.focusHandler$.next(event);
  };

  handleHero = () => {
    setTimeout(() => {
      cardFocusChange$.next({ ...this.state.images, ...this.props });
    });
  };

  render() {
    const { original_title } = this.props;
    const { posterUrl } = this.state.images;
    return (
      <img
        data-height={this.height}
        data-width={this.width}
        data-component="basic-card"
        ref={this.basicCard}
        tabIndex="-1"
        className={styles["basic-card"]}
        onKeyDown={this.handleFocus}
        aria-label={original_title}
        onFocus={this.handleHero}
        alt=""
        src={posterUrl}
      ></img>
    );
  }
}
