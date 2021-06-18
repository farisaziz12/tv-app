import { Home } from "../Home";
import { GenrePage } from "../GenrePage";
import { Show } from "../Show";
import { Error404, NetworkError } from "../Errors";

export const routes = [
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/genre/:genre",
    component: GenrePage,
  },
  {
    path: "/show/:id",
    component: Show,
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
