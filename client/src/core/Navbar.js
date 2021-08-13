import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import auth from '../auth/Auth-User/auth-helper';
import SignoutBtn from '../auth/Auth-User/Signout';

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return { backgroundColor: '#013e69', fontSize: '16px'};
  else
    return { backgroundColor: 'transparent', fontSize: '16px'};
};

const Navbar = withRouter(({history}) => (
  <Menu mode="horizontal" theme='dark'>
    <Menu.Item style={isActive(history, '/')}>
      <Link to="/"><HomeFilled className='home-icon' /></Link>
    </Menu.Item>
    <Menu.Item style={isActive(history, '/polls')}>
      <Link to="/polls">
        <span>Polls</span>
      </Link>
    </Menu.Item>
    {
      !auth.isAuthenticated() && <>
        <Menu.Item style={isActive(history, '/signup')}>
          <Link to="/signup">
            <span>Sign up
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item style={isActive(history, '/signin')}>
          <Link to="/signin">
            <span>Sign In
            </span>
          </Link>
        </Menu.Item>
      </>}
    {auth.isAuthenticated() && <>
      <Menu.Item style={isActive(history, '/user/' + auth.isAuthenticated().user._id)}>
        <Link to={'/user/' + auth.isAuthenticated().user._id}>
          <span>My Profile</span>
        </Link>
      </Menu.Item>
      {
        auth.isAuthenticated() && (auth.isAuthenticated().user.role === 'admin' || auth.isAuthenticated().user.role === 'power-user') && (
          <>
            <Menu.Item style={isActive(history, '/manage-polls')}>
              <Link to="/manage-polls">Manage Polls</Link>
            </Menu.Item >
            {auth.isAuthenticated() && auth.isAuthenticated().user.role === 'admin' && <Menu.Item style={isActive(history, '/manage-users')}>
              <Link to="/manage-users">Manage Users</Link>
            </Menu.Item>}
          </>
        )
      }
      <Menu.Item>
        <SignoutBtn />
      </Menu.Item>
    </>}
  </Menu>
));

export default Navbar;
