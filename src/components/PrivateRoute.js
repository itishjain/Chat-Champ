import React from "react";
import { Redirect, Route } from "react-router";

const PrivateRoute = ({ children, ...routeProps }) => {
  // As we donot have any profile we will create a boolean variable and set it to False
  const profile = false; //  Always on sign in page due to false

  if (!profile) {
    // If we dont have profile we will redirect to sign
    return <Redirect to="/signin" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
