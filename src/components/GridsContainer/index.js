import React, { useEffect } from "react";
import { Subject } from "rxjs";
import { auditTime } from "rxjs/operators";
import { isEmpty, path, propOr } from "ramda";
import { Grid } from "../Grid";
import { FocusManager, keyHandler, logger, resolveComponent } from "../../utils";
import { useHistory } from "react-router";
import styles from "./GridsContainer.module.css";

export const focusHandler$ = new Subject();

focusHandler$.pipe(auditTime(200)).subscribe((event) => {
  const focusManager = new FocusManager(event);
  focusManager.handleGridFocusDirection();
});

export function GridsContainer({
  grids = [],
  position = {},
  noTarget = {},
  focusOnMount = true,
}) {
  const history = useHistory();

  useEffect(() => {
    if (focusOnMount) {
      const focusManager = new FocusManager();
      focusManager.initialGridFocus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("show-page", navigateToShowPage);
    document.addEventListener("no-nav-target", noTargetFunc);
    return () => {
      document.removeEventListener("show-page", navigateToShowPage);
      document.removeEventListener("no-nav-target", noTargetFunc);
    };
  }, []);

  const noTargetFunc = (event) => {
    const syntheticEvent = propOr({}, "detail", event);
    if (isEmpty(noTarget)) {
      logger("No target").warn();
    } else {
      keyHandler(syntheticEvent, noTarget);
    }
  };

  const navigateToShowPage = (event) => {
    const id = path(["detail", "id"], event);

    if (id) {
      history.push(`/show/${id}` + window.location.search);
    }
  };
  return (
    <div
      style={position}
      data-component="grids-container"
      className={styles["grids-container"]}
    >
      {grids.map((grid, index) => {
        const children = grid.cards.map((card) => resolveComponent(grid.component, card));
        return <Grid key={index} children={children} />;
      })}
    </div>
  );
}
