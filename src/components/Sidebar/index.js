import React from "react";
import { SidebarItem } from "./SidebarItem";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div data-component="sidebar-items" className={styles["sidebar-items-container"]}>
        <SidebarItem href="/home">Home</SidebarItem>
        <SidebarItem href="/homes">fail</SidebarItem>
        <SidebarItem href="/home">Home</SidebarItem>
        <SidebarItem href="/home">Home</SidebarItem>
        <SidebarItem href="/home">Home</SidebarItem>
        <SidebarItem href="/home">Home</SidebarItem>
      </div>
    </div>
  );
}
