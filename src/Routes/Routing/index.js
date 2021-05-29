import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Sidebar } from "../../components";
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
        <Sidebar /> {/* render for all paths*/}
        <Switch>
          {renderRoutes()}
          <NotFoundComponent />
        </Switch>
      </Router>
    </div>
  );
}
