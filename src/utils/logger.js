import { urlParams } from "./urlParams";

export const logger = (text) => {
  const isDebugMode = urlParams("debug");
  const log = () => isDebugMode && console.log(text);
  const warn = () => isDebugMode && console.warn(text);
  const error = () => isDebugMode && console.error(text);
  return { log, warn, error };
};
