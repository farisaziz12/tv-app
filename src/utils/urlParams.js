import { parse } from "qs";
import { TYPES } from "../Types";

export const urlParams = (param) => {
  const params = parse(window.location.search, { ignoreQueryPrefix: true });
  switch (param) {
    case TYPES.DEBUG:
      return params.debug === "true";
    case TYPES.PERFORMANCE:
      return params.perf;
    case TYPES.DEMO:
      return params.demo === "true";

    default:
      break;
  }
};
