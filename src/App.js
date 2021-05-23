import { RoutingManager } from "./Routes";
import { Error404 } from "./Routes";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles["app-container"]}>
      <RoutingManager NotFoundComponent={Error404} />
    </div>
  );
}

export default App;
