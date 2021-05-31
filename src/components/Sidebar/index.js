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
      focusManager.handleFocusLastCard();
    });

    return () => {
      unlisten();
    };
  }, [history]);

  return (
    <div className={styles.sidebar}>
      <div data-component="sidebar-items" className={styles["sidebar-items-container"]}>
        <SidebarItem href="/home">Home</SidebarItem>
        <SidebarItem href="/genre-page/horror">Horror</SidebarItem>
        <SidebarItem href="/genre-page/action">Action</SidebarItem>
        <SidebarItem href="/genre-page/comedy">Comedy</SidebarItem>
        <SidebarItem href="/genre-page/family">Family</SidebarItem>
        <SidebarItem href="/homes">Fail</SidebarItem>
      </div>
    </div>
  );
}
