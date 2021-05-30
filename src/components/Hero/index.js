import { propOr } from "ramda";
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

  const renderImage = () => {
    const { backdropUrl = "" } = card;
    if (backdropUrl) {
      return <img src={backdropUrl} alt="" />;
    } else {
      return <div className={styles["img-fallback"]}>TV App</div>;
    }
  };

  const renderGenres = () => {
    const genres = propOr([], ["genres"], card);

    if (genres[0]) {
      return (
        <div className={styles["genres-container"]}>
          {genres.map((genre, index) => (
            <div key={index}>
              <span className={styles.dot}></span>
              <div className={styles.genre}>{genre}</div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={styles["hero-cover"]}>
      <div data-component="hero" className={styles["hero"]}>
        <div className={styles["metadata-container"]}>
          <div className={styles.title}>{card?.title}</div>
          <div className={styles["release-date"]}>{card?.releaseDate}</div>
          {renderGenres()}
          <div className={styles.description}>{card?.description}</div>
        </div>
        {renderImage()}
      </div>
    </div>
  );
}
