import React, { Component } from "react";
import { Subject } from "rxjs";
import { auditTime } from "rxjs/operators";
import { FocusManager } from "../../utils";
import { cardFocusChange$ } from "../Hero";
import { PlayerEvent } from "../GridsContainer";
import styles from "./BasicCard.module.css";

export class BasicCard extends Component {
  static contextType = PlayerEvent;
  constructor() {
    super();
    this.height = 18.5; //vw
    this.width = 11.5; //vw
    this.focusHandler$ = new Subject();

    this.focusHandler$.pipe(auditTime(200)).subscribe((event) => {
      const focusManager = new FocusManager(event);
      focusManager.handleGridFocusDirection();
    });
  }

  handleFocus = (event) => {
    if (event.key === "Enter") {
      this.context(); // player event
    } else {
      this.focusHandler$.next(event);
    }
  };

  handleHero = () => {
    cardFocusChange$.next({ ...this.props });
  };

  render() {
    const { title, posterUrl } = this.props;

    return (
      <img
        loading="lazy"
        data-height={this.height}
        data-width={this.width}
        data-component="basic-card"
        ref={this.basicCard}
        tabIndex="-1"
        className={styles["basic-card"]}
        onKeyDown={this.handleFocus}
        aria-label={title}
        onFocus={this.handleHero}
        alt=""
        src={posterUrl}
      ></img>
    );
  }
}
