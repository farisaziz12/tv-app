import { RoutingManager } from "./Routes";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles["app-container"]}>
      <RoutingManager />
    </div>
  );
}

export default App;
