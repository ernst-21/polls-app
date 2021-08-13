import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './auth/Auth-User/Signin';
import EditProfile from './user/EditProfile';
import Profile from './user/Profile';
import { PrivateRoute, AdminRoute, AdminPowerUserRoute } from './auth/Auth-User/PrivateRoute';
import ResetPassword from './auth/Auth-User/ResetPassword';
import EmailRequest from './auth/Auth-User/EmailRequest';
import InfoSuccess from './user/InfoSuccess';
import PollsView from './polls/PollsView';
import ManagePolls from './auth/Auth-Polls/ManagePolls';
import ManageUsers from './auth/Auth-User/ManageUsers';
import CreatePoll from './auth/Auth-Polls/CreatePoll';
import EditUserProfile from './auth/Auth-User/EditUserProfile';
import CreateUser from './auth/Auth-User/CreateUser';
import InfoError from './core/InfoError';

const MainRouter = () => {
  return (
    <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/polls" component={PollsView} />
        <AdminPowerUserRoute path="/manage-polls" component={ManagePolls} />
        <AdminRoute path="/manage-users" component={ManageUsers} />
        <AdminPowerUserRoute path="/create-poll" component={CreatePoll} />
        <AdminRoute path="/create-user" component={CreateUser} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/reset/edit/:token" component={ResetPassword} />
        <Route path="/email" component={EmailRequest} />
        <Route path="/info" component={InfoSuccess} />
        <Route path="/info-network-error" component={InfoError} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <AdminRoute path="/user/edit-user/:userId" component={EditUserProfile} />
        <Route path="/user/:userId" component={Profile} />
      </Switch>
    </div>

  );
};

export default MainRouter;
