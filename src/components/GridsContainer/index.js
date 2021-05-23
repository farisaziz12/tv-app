import React, { useEffect } from "react";
import { BasicCard } from "../BasicCard";
import { Grid } from "../Grid";
import { FocusManager } from "../../utils";
import styles from "./GridsContainer.module.css";

export function GridsContainer({ grids }) {
  useEffect(() => {
    const focusManager = new FocusManager();
    focusManager.initialGridFocus();
  }, []);

  return (
    <div data-component="grids-container" className={styles["grids-container"]}>
      {grids.map((grid, index) => {
        const children = grid.cards.map((card) => <BasicCard key={card.id} {...card} />);
        return <Grid key={index} children={children} />;
      })}
    </div>
  );
}
