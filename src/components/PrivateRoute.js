import React from "react";
import { Container, Loader } from "rsuite";
import { Redirect, Route } from "react-router";
import { useProfile } from "../context/profile.context";

const PrivateRoute = ({ children, ...routeProps }) => {
  // As we donot have any profile we will create a boolean variable and set it to False
  // const profile = false; //  Always on sign in page due to false

  const { profile, isLoading } = useProfile();

  if (isLoading && !profile) {
    return (
      <Container>
        <Loader
          center
          vertical
          size="md"
          content="Loading"
          speed="slow"
        ></Loader>
      </Container>
    );
  }

  if (!profile && !isLoading) {
    // If we dont have profile we will redirect to sign
    return <Redirect to="/signin" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
