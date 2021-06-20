import React, { useEffect } from "react";
import { SidebarItem } from "./SidebarItem";
import { FocusManager } from "../../utils";
import { useHistory } from "react-router";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      const focusManager = new FocusManager();
      focusManager.handleFocusLastElement();
    });

    return () => {
      unlisten();
    };
  }, [history]);

  return (
    <div className={styles.sidebar}>
      <div data-component="sidebar-items" className={styles["sidebar-items-container"]}>
        <SidebarItem href="/home">Home</SidebarItem>
        <SidebarItem href="/genre/horror">Horror</SidebarItem>
        <SidebarItem href="/genre/action">Action</SidebarItem>
        <SidebarItem href="/genre/comedy">Comedy</SidebarItem>
        <SidebarItem href="/genre/family">Family</SidebarItem>
        <SidebarItem href="/search">Search</SidebarItem>
      </div>
    </div>
  );
}
