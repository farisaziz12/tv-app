import React from "react";
import { Link } from "react-router-dom";
import { FocusManager } from "../../../utils";
import styles from "../Sidebar.module.css";

export function SidebarItem({ children, text, href }) {
  const handleKeyDown = (event) => {
    const focusManager = new FocusManager(event);
    focusManager.handleSidebarFocusDirection();
  };
  return (
    <Link
      data-component="sidebar-item"
      onKeyDown={handleKeyDown}
      className={styles["sidebar-item"]}
      to={(location) => href + location.search}
    >
      <span className={styles.icon}></span>
      <div className={styles["sidebar-item-title"]}>{children || text}</div>
    </Link>
  );
}
