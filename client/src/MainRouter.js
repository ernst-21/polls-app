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
import ResetPassword from './auth/ResetPassword';
import EmailRequest from './auth/EmailRequest';
import InfoSuccess from './user/InfoSuccess';
import PollBreadcrumb from './auth/PollBreadcrumb';
import PollsView from './polls/PollsView';
import ManagePolls from './auth/ManagePolls';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <main>
        <PollBreadcrumb />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/polls" component={PollsView} />
          <Route path="/manage-polls" component={ManagePolls} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/reset/edit/:token" component={ResetPassword} />
          <Route path="/email" component={EmailRequest} />
          <Route path="/info" component={InfoSuccess} />
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <Route path="/user/:userId" component={Profile} />
        </Switch>
      </main>
    </div>
  );
};

export default MainRouter;
