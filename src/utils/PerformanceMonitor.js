import React, { useEffect } from "react";
import { StatsGraph } from "@helpscout/stats";
import { urlParams } from "./urlParams";

export function PerformanceMonitor({ children }) {
  useEffect(() => {
    const isDebugMode = urlParams("debug");
    if (isDebugMode) {
      const graphs = Array.from(document.querySelectorAll("canvas"));
      graphs.forEach((graph) => {
        graph.style.width = "9vw";
        graph.style.height = "7vw";
      });
    }
  }, []);

  const renderPerformanceGraphs = () => {
    const isDebugMode = urlParams("debug");
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
