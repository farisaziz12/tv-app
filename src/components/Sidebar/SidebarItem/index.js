import React from "react";
import { FocusManager } from "../../../utils";
import styles from "../Sidebar.module.css";

export function SidebarItem({ children, text, href }) {
  const handleKeyDown = (event) => {
    const focusManager = new FocusManager(event);
    focusManager.handleSidebarFocusDirection();
  };
  return (
    <a
      data-component="sidebar-item"
      onKeyDown={handleKeyDown}
      className={styles["sidebar-item"]}
      href={href}
    >
      <img
        src="https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/home-512.png"
        alt=""
        className={styles.icon}
      />
      <div className={styles["sidebar-item-title"]}>{children || text}</div>
    </a>
  );
}
