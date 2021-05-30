import { Home } from "../Home";
import { Error404, NetworkError } from "../Errors";
export const routes = [
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/not-found",
    component: Error404,
  },
  {
    path: "/network-error",
    component: NetworkError,
  },
];
