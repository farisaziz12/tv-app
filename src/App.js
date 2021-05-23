import { RoutingManager } from "./Routes";
import { Error404 } from "./Routes";
import Sidebar from "./components/Sidebar";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles["app-container"]}>
      <RoutingManager NotFoundComponent={Error404} />
      <Sidebar />
    </div>
  );
}

export default App;
