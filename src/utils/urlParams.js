import { parse } from "qs";
import { TYPES } from "../Types";
import { convertBooleanString } from "./functions";

export const urlParams = (param) => {
  const params = parse(window.location.search, { ignoreQueryPrefix: true });
  switch (param) {
    case TYPES.DEBUG:
      return convertBooleanString(params.debug);
    case TYPES.PERFORMANCE:
      return params.perf;
    case TYPES.DEMO:
      return convertBooleanString(params.demo);

    default:
      break;
  }
};
