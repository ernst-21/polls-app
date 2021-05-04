import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Users from './user/Users';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import EditProfile from './user/EditProfile';
import Profile from './user/Profile';
import PrivateRoute from './auth/PrivateRoute';
import Menu from './core/Menu';
import RetrievePassword from './auth/RetrievePassword';
import EmailRequest from './auth/EmailRequest';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/reset" component={RetrievePassword} />
          <Route path="/email" component={EmailRequest} />
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <Route path="/user/:userId" component={Profile} />
        </Switch>
      </main>
    </div>
  );
};

export default MainRouter;
