import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Sidebar } from "../../components";
import { Error404 } from "../Errors";
import { offlineCheck$ } from "../../BootstrapFunctions";
import { routes } from "./config";
import { Subject } from "rxjs";

export const notFound$ = new Subject();

export function RoutingManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const offlineSubscription = offlineCheck$.subscribe(setIsOffline);
    const notFoundSubscription = notFound$.subscribe(setIsNotFound);
    return () => {
      offlineSubscription.unsubscribe();
      notFoundSubscription.unsubscribe();
    };
  }, []);

  const renderRoutes = () => {
    return routes.map((route, index) => (
      <Route
        path={route.path}
        key={index}
        render={(props) => <route.component key={Math.random()} {...props} />} // random key forces page reload
      />
    ));
  };

  const renderError = () => {
    if (isOffline) {
      return <Redirect push to="/network-error" />;
    }
    if (isNotFound) {
      return <Redirect push to={{ pathname: "/not-found", state: { failure: true } }} />;
    }
  };

  return (
    <div>
      <Router>
        {renderError()}
        <Sidebar /> {/* render for all paths*/}
        <Switch>
          <Route exact path="/">
            <Redirect push to={{ pathname: "/home", search: window.location.search }} />
          </Route>
          {renderRoutes()}
          <Error404 />
        </Switch>
      </Router>
    </div>
  );
}
