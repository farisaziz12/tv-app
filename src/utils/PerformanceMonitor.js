import React, { useEffect } from "react";
import { StatsGraph } from "@helpscout/stats";
import { urlParams } from "./urlParams";

export function PerformanceMonitor({ children }) {
  const isDebugMode = urlParams("debug");

  useEffect(() => {
    if (isDebugMode) {
      const graphs = Array.from(document.querySelectorAll("canvas"));
      graphs.forEach((graph) => {
        graph.style.width = "9vw";
        graph.style.height = "7vw";
      });
    }
  }, [isDebugMode]);

  const renderPerformanceGraphs = () => {
    if (isDebugMode) {
      return <StatsGraph />;
    }
  };

  return (
    <div>
      {renderPerformanceGraphs()}
      {children}
    </div>
  );
}
