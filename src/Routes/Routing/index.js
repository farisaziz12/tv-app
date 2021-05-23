import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { routes } from "./config";

export function RoutingManager({ NotFoundComponent }) {
  const renderRoutes = () => {
    return routes.map((route, index) => (
      <Route
        path={route.path}
        key={index}
        render={(props) => <route.component {...props} />}
      />
    ));
  };
  return (
    <div>
      <Router>
        <Switch>
          {renderRoutes()}
          <NotFoundComponent />
        </Switch>
      </Router>
    </div>
  );
}
