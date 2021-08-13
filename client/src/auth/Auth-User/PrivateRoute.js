import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './auth-helper';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const AdminPowerUserRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      (auth.isAuthenticated() && (auth.isAuthenticated().user.role === 'admin' || 'power-user')) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      (auth.isAuthenticated() && (auth.isAuthenticated().user.role === 'admin')) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export {PrivateRoute, AdminPowerUserRoute, AdminRoute};
