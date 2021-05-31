import React, { useEffect } from "react";
import { path } from "ramda";
import { Grid } from "../Grid";
import { FocusManager, resolveComponent } from "../../utils";
import { useHistory } from "react-router";
import styles from "./GridsContainer.module.css";

export function GridsContainer({ grids }) {
  const history = useHistory();

  useEffect(() => {
    const focusManager = new FocusManager();
    focusManager.initialGridFocus();
  }, []);

  const navigateToShowPage = (event) => {
    const id = path(["detail", "id"], event);

    if (id) {
      history.push(`/show/${id}` + window.location.search);
    }
  };

  useEffect(() => {
    document.addEventListener("show-page", navigateToShowPage);
    return () => {
      document.removeEventListener("show-page", navigateToShowPage);
    };
  }, []);

  return (
    <div data-component="grids-container" className={styles["grids-container"]}>
      {grids.map((grid, index) => {
        const children = grid.cards.map((card) => resolveComponent(grid.component, card));
        return <Grid key={index} children={children} />;
      })}
    </div>
  );
}
