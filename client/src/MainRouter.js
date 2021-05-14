import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
//import Users from './user/Users';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import EditProfile from './user/EditProfile';
import Profile from './user/Profile';
import PrivateRoute from './auth/PrivateRoute';
import ResetPassword from './auth/ResetPassword';
import EmailRequest from './auth/EmailRequest';
import InfoSuccess from './user/InfoSuccess';
import PollBreadcrumb from './auth/PollBreadcrumb';
import PollsView from './polls/PollsView';
import ManagePolls from './auth/ManagePolls';
import ManageUsers from './auth/ManageUsers';
import CreatePoll from './auth/CreatePoll';
import CreateUser from './auth/CreateUser';
import EditUserProfile from './auth/EditUserProfile';


const MainRouter = () => {
  return (
    <>
      <PollBreadcrumb />
      <div className="site-layout-content">
        <Switch>
          <Route exact path="/" component={Home} />
          {/*<Route path="/users" component={Users} />*/}
          <Route path="/polls" component={PollsView} />
          <Route path="/manage-polls" component={ManagePolls} />
          <Route path="/manage-users" component={ManageUsers} />
          <Route path="/create-poll" component={CreatePoll} />
          <Route path="/create-user" component={CreateUser} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/reset/edit/:token" component={ResetPassword} />
          <Route path="/email" component={EmailRequest} />
          <Route path="/info" component={InfoSuccess} />
          <Route path="/user/edit-user/:userId" component={EditUserProfile} />
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <Route path="/user/:userId" component={Profile} />
        </Switch>
      </div>
    </>
  );
};

export default MainRouter;
