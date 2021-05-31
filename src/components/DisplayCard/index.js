import { path, prop } from "ramda";
import React, { Component } from "react";
import { Subject } from "rxjs";
import { auditTime } from "rxjs/operators";
import { FocusManager } from "../../utils";
import { dispatchPlayEvent, dispatchShowPageEvent } from "../../Events";
import { cardFocusChange$ } from "../Hero";
import styles from "./DisplayCard.module.css";

export class DisplayCard extends Component {
  constructor(props) {
    super(props);
    this.height = 13.5; //vw
    this.width = 18.485; //vw

    this.focusHandler$ = new Subject();
    this.focusHandler$.pipe(auditTime(200)).subscribe((event) => {
      const focusManager = new FocusManager(event);
      focusManager.handleGridFocusDirection();
    });

    this.handleFocus.bind(this);
    this.handleHero.bind(this);
  }

  handleFocus = (event) => {
    if (event.key === "Enter") {
      const id = path(["target", "dataset", "id"], event);
      dispatchShowPageEvent(id);
    } else {
      this.focusHandler$.next(event);
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
      >
        <div
          style={{ backgroundImage: `url(${backdropUrl})` }}
          className={styles["display-card"]}
        ></div>
        {this.renderTitle()}
        {this.renderGenre()}
      </div>
    );
  }
}
