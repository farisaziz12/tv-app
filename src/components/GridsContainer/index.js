import React, { useEffect, createContext } from "react";
import { BasicCard } from "../BasicCard";
import { Grid } from "../Grid";
import { FocusManager } from "../../utils";
import styles from "./GridsContainer.module.css";

export const PlayerEvent = createContext();

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

  const dispatchPlayEvent = () => {
    const playEvent = new CustomEvent("play-video");
    document.dispatchEvent(playEvent);
  };

  return (
    <div data-component="grids-container" className={styles["grids-container"]}>
      {grids.map((grid, index) => {
        const children = grid.cards.map((card) => <BasicCard key={card.id} {...card} />);
        return (
          <PlayerEvent.Provider key={index} value={dispatchPlayEvent}>
            <Grid children={children} />
          </PlayerEvent.Provider>
        );
      })}
    </div>
  );
}
