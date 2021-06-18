import { TYPES } from "../Types";
import { urlParams } from "./urlParams";

export const logger = (...args) => {
  const isDebugMode = urlParams(TYPES.DEBUG);
  const log = () => isDebugMode && console.log(...args);
  const warn = () => isDebugMode && console.warn(...args);
  const error = () => isDebugMode && console.error(...args);
  return { log, warn, error };
};
