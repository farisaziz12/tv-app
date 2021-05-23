import React, { Component } from "react";
import { Subject } from "rxjs";
import { auditTime } from "rxjs/operators";
import { FocusManager } from "../../utils";
import { cardFocusChange$ } from "../Hero";
import styles from "./BasicCard.module.css";

export class BasicCard extends Component {
  constructor() {
    super();
    this.height = 16.889375; //vw
    this.width = 11; //vw
    this.focusHandler$ = new Subject();

    this.focusHandler$.pipe(auditTime(100)).subscribe((event) => {
      const focusManager = new FocusManager(event);
      focusManager.handleGridFocusDirection();
    });
  }

  handleFocus = (event) => {
    this.focusHandler$.next(event);
  };

  handleHero = () => {
    cardFocusChange$.next(this.props);
  };

  render() {
    const { poster_path, original_title } = this.props;
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
        src={"https://image.tmdb.org/t/p/w500" + poster_path}
      ></img>
    );
  }
}
