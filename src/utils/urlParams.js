import { parse } from "qs";

export const urlParams = (param) => {
  const params = parse(window.location.search, { ignoreQueryPrefix: true });
  switch (param) {
    case "debug":
      return params.debug === "true";

    default:
      break;
  }
};
