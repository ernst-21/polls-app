import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import auth from '../auth/auth-helper';
import SignoutBtn from '../auth/Signout';



const Navbar = withRouter(({ history }) => (
  <Menu mode="horizontal" theme='dark'>
    <Menu.Item>
      <Link to="/"><HomeFilled className='home-icon' /></Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/polls">
        <span >Polls</span>
      </Link>
    </Menu.Item>
    {
      !auth.isAuthenticated() && <>
        <Menu.Item>
          <Link to="/signup">
            <span >Sign up
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/signin">
            <span>Sign In
            </span>
          </Link>
        </Menu.Item>
      </>}
    {auth.isAuthenticated() && <>
      <Menu.Item>
        <Link to={'/user/' + auth.isAuthenticated().user._id}>
          <span>My Profile</span>
        </Link>
      </Menu.Item>
      <Menu.Item>

        <SignoutBtn onClick={() => {
          auth.clearJWT(() => history.push('/signin'));
        }}>Sign out</SignoutBtn>
      </Menu.Item>
    </>}
  </Menu>
));

export default Navbar;
