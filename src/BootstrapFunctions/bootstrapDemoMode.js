import { useEffect, useState } from "react";
import { urlParams, DOM } from "../utils";
import styles from "./DemoModal.module.css";

const DemoModal = ({ children }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const dom = new DOM();
    const component = dom.getComponent("explore-button").focus();
    const removeListener = component.listenFor(["Enter"], () => setShow(false));

    return () => {
      removeListener();
    };
  }, []);

  const renderModal = () => {
    if (show) {
      return (
        <div className={styles.container}>
          <div className={styles["header-text"]}>Welcome to the demo TV App!</div>
          <div className={styles.description}>
            For the best experience (like on a TV) navigate using the up, down, left and
            right arrow keys. Use the enter key to select and backspace to exit. Ideally
            set the screen aspect ratio to 16:9/1920x1080
          </div>
          <div className={styles["features-header"]}>Notable features to explore:</div>
          <div className={styles.list}>
            <li>Hero (transitions as you scroll through cards)</li>
            <li>Accessibility Friendly with Text-To-Speech integration</li>
            <li>
              Debugging tools (enabled using <strong>"debug=true"</strong> URL parameter)
            </li>
            <li>
              Video Player with custom controls (launched by pressing{" "}
              <strong>enter</strong> on any card)
            </li>
            <li>
              Network health checks (automatic redirect to offline page and redirect back
              when online)
            </li>
            <li>
              Performance Tiers for low to high powered devices (enabled using{" "}
              <strong>"perf=lowest/low/mid/high"</strong> URL parameter)
            </li>
          </div>
          <div
            className={styles["explore-button"]}
            data-component="explore-button"
            tabIndex="-1"
          >
            Explore App
          </div>
        </div>
      );
    } else {
      return children;
    }
  };

  return renderModal();
};

export const bootstrapDemoMode = (app) => {
  const isDemoMode = urlParams("demo");
  const hasSeenDemoModal = localStorage?.getItem("seen_demo_modal");

  if (isDemoMode && !hasSeenDemoModal) {
    localStorage.setItem("seen_demo_modal", true);
    return <DemoModal>{app}</DemoModal>;
  } else {
    return app;
  }
};
