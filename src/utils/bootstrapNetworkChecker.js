import { pathOr } from "ramda";
import { Subject } from "rxjs";
import { logger } from "./logger";

export const offlineCheck$ = new Subject();

export const bootstrapNetworkChecker = (app) => {
  setInterval(() => {
    const isOnline = pathOr(true, ["navigator", "onLine"], window);

    if (isOnline) {
      logger("Health Check:", "Online").log();
      offlineCheck$.next(false);
    } else {
      logger("Health Check:", "Offline").error();
      offlineCheck$.next(true);
    }
  }, 7000);

  return app;
};
