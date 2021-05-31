import { Home } from "../Home";
import { GenrePage } from "../GenrePage";
import { Error404, NetworkError } from "../Errors";

export const routes = [
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/genre-page/:genre",
    component: GenrePage,
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
