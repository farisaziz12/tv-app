import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Sidebar } from "../../components";
import { Error404 } from "../Errors";
import { offlineCheck$ } from "../../BootstrapFunctions";
import { routes } from "./config";

export function RoutingManager() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const subscription = offlineCheck$.subscribe(setIsOffline);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderRoutes = () => {
    return routes.map((route, index) => (
      <Route
        path={route.path}
        key={index}
        render={(props) => <route.component {...props} />}
      />
    ));
  };

  const renderError = () => {
    if (isOffline) {
      return <Redirect push to="/network-error" />;
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
