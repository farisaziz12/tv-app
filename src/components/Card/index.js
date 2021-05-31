import { Component } from "react";
import { Subject } from "rxjs";
import { auditTime } from "rxjs/operators";
import { FocusManager } from "../../utils";
import { cardFocusChange$ } from "../Hero";
import { dispatchPlayEvent } from "../GridsContainer";

export class Card extends Component {
  constructor(props) {
    super(props);

    this.height = 0; //vw
    this.width = 0; //vw
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
      dispatchPlayEvent(); // player event
    } else {
      this.focusHandler$.next(event);
    }
  };

  handleHero = () => {
    cardFocusChange$.next({ ...this.props });
  };
}
