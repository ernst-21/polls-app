import React from 'react';
import { Link } from 'react-router-dom';
import { HomeFilled } from '@ant-design/icons';
import auth from '../auth/Auth-User/auth-helper';
import SignoutBtn from '../auth/Auth-User/Signout';

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return { backgroundColor: '#013e69', fontSize: '16px', color: '#fff' };
  else
    return { backgroundColor: 'transparent', fontSize: '16px', color: '#dddddd' };
};

const MenuItems = (props) => {

  return (
    <ul className={props.className}>
      <li style={isActive(props.history, '/')}><Link to="/">
        <HomeFilled className='home-icon'
          style={isActive(props.history, '/')} /></Link></li>
      <li style={isActive(props.history, '/polls')}>
        <Link to="/polls">
          <span style={isActive(props.history, '/polls')}>Polls</span>
        </Link>
      </li>
      {
        !auth.isAuthenticated() && <>
          <li style={isActive(props.history, '/signup')}>
            <Link to="/signup">
              <span style={isActive(props.history, '/signup')}>Sign up
              </span>
            </Link>
          </li>
          <li style={isActive(props.history, '/signin')}>
            <Link to="/signin">
              <span style={isActive(props.history, '/signin')}>Sign In
              </span>
            </Link>
          </li>
        </>}
      {auth.isAuthenticated() && <>
        {auth.isAuthenticated().user.role !== 'admin' &&
        <li style={isActive(props.history, '/user/' + auth.isAuthenticated().user._id)}>
          <Link to={'/user/' + auth.isAuthenticated().user._id}>
            <span style={isActive(props.history, '/user/' + auth.isAuthenticated().user._id)}>My Profile</span>
          </Link>
        </li>
        }
        {
          auth.isAuthenticated() && (auth.isAuthenticated().user.role === 'admin' || auth.isAuthenticated().user.role === 'power-user') && (
            <>
              <li style={isActive(props.history, '/manage-polls')}>
                <Link to="/manage-polls"><span style={isActive(props.history, '/manage-polls')}>Manage Polls</span></Link>
              </li>
              {auth.isAuthenticated() && auth.isAuthenticated().user.role === 'admin' &&
              <li style={isActive(props.history, '/manage-users')}>
                <Link to="/manage-users"><span style={isActive(props.history, '/manage-users')}>Manage Users</span></Link>
              </li>
              }
            </>
          )
        }
        <SignoutBtn />
      </>}
    </ul>
  );
};

export default MenuItems;
