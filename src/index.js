import React from "react";
import ReactDOM from "react-dom";
import { of } from "rxjs";
import { take, map } from "rxjs/operators";
import App from "./App";
import {
  bootstrapPerformanceMonitor,
  bootstrapNetworkChecker,
  bootstrapDemoMode,
} from "./BootstrapFunctions";
import "./index.css";

of(<App />)
  .pipe(take(1))
  .pipe(map(bootstrapPerformanceMonitor))
  .pipe(map(bootstrapDemoMode))
  .pipe(bootstrapNetworkChecker)
  .subscribe((app) => {
    ReactDOM.render(
      <React.StrictMode>{app}</React.StrictMode>,
      document.getElementById("root")
    );
  });
