import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import EditProfile from './user/EditProfile';
import Profile from './user/Profile';
import {PrivateRoute, AdminRoute, AdminPowerUserRoute} from './auth/PrivateRoute';
import ResetPassword from './auth/ResetPassword';
import EmailRequest from './auth/EmailRequest';
import InfoSuccess from './user/InfoSuccess';
import PollBreadcrumb from './auth/PollBreadcrumb';
import PollsView from './polls/PollsView';
import ManagePolls from './auth/ManagePolls';
import ManageUsers from './auth/ManageUsers';
import CreatePoll from './auth/CreatePoll';
import EditUserProfile from './auth/EditUserProfile';
import CreateUser from './auth/CreateUser';

const MainRouter = () => {
  return (
    <>
      <PollBreadcrumb />
      <div className="site-layout-content">
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
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <AdminRoute path="/user/edit-user/:userId" component={EditUserProfile} />
          <Route path="/user/:userId" component={Profile} />
        </Switch>
      </div>
    </>
  );
};

export default MainRouter;
