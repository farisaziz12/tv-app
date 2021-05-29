import React, { useState, useEffect } from "react";
import { Subject } from "rxjs";
import { DOM } from "../../utils";
import styles from "./Hero.module.css";

export const cardFocusChange$ = new Subject();

export function Hero() {
  const [card, setCard] = useState({});
  const dom = new DOM();

  useEffect(() => {
    const subscription = cardFocusChange$.subscribe((newCard) => {
      if (card !== newCard) {
        setCard(newCard);

        const { component } = dom.getComponent("hero");
        component.classList.add(styles.transition);

        setTimeout(() => {
          component.classList.remove(styles.transition);
        }, 300);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card]);

  return (
    <div className={styles["hero-cover"]}>
      <div data-component="hero" className={styles["hero"]}>
        <div className={styles["metadata-container"]}>
          <div className={styles.title}>{card?.title}</div>
          <div className={styles.description}>{card?.description}</div>
        </div>
        <img src={card?.backdropUrl} alt="" />
      </div>
    </div>
  );
}
