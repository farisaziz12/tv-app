import React, { Component } from "react";
import styles from "./Grid.module.css";

export class Grid extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={styles["grid"]} data-component="grid">
        {children}
      </div>
    );
  }
}
