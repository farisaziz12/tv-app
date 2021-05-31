import React, { useEffect } from "react";
import { BasicCard } from "../BasicCard";
import { DisplayCard } from "../DisplayCard";
import { Grid } from "../Grid";
import { FocusManager } from "../../utils";
import styles from "./GridsContainer.module.css";

export const dispatchPlayEvent = () => {
  const playEvent = new CustomEvent("play-video");
  document.dispatchEvent(playEvent);
};

export function GridsContainer({ grids, playVideo }) {
  useEffect(() => {
    const focusManager = new FocusManager();
    focusManager.initialGridFocus();
  }, []);

  useEffect(() => {
    document.addEventListener("play-video", playVideo);
    return () => {
      document.removeEventListener("play-video", playVideo);
    };
  }, [playVideo]);

  return (
    <div data-component="grids-container" className={styles["grids-container"]}>
      {grids.map((grid, index) => {
        const children = grid.cards.map((card) => (
          <DisplayCard key={card.id} {...card} />
        ));
        return <Grid key={index} children={children} />;
      })}
    </div>
  );
}
