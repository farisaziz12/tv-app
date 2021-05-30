import { pathOr } from "ramda";
import { Subject } from "rxjs";
import { logger } from "../utils/logger";

export const offlineCheck$ = new Subject();

export const bootstrapNetworkChecker = (app) => {
  setInterval(() => {
    const isOnline = pathOr(true, ["navigator", "onLine"], window);

    if (isOnline) {
      logger("Network Health Check:", "Online").log();
    } else {
      logger("Network Health Check:", "Offline").error();
    }
    offlineCheck$.next(!isOnline);
  }, 7000);

  return app;
};
