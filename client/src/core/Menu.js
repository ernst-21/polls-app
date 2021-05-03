import React from 'react';
import { MenuOutlined, HomeFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import SignoutBtn from '../auth/Signout';
import auth from './../auth/auth-helper';

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return { color: '#28079d' };
  else
    return { color: '#1890FF' };
};


const Menu = withRouter(({ history }) => (
  <nav>
    <div className="nav-center">
      <div className="nav-header">
        <button className="nav-toggle">
          <MenuOutlined />
        </button>
      </div>
      <div className="links-container">
        <ul className="links">
          <li>
            <Link to="/"><HomeFilled style={isActive(history, '/')} className='home-icon' /></Link>
          </li>
          <li>
            <Link to="/users">
              <Button style={isActive(history, '/users')}>Users</Button>
            </Link>
          </li>
          {
            !auth.isAuthenticated() && <>
              <li>
                <Link to="/signup">
                  <Button style={isActive(history, '/signup')}>Sign up
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/signin">
                  <Button style={isActive(history, '/signin')}>Sign In
                  </Button>
                </Link>
              </li>
            </>}
          {auth.isAuthenticated() && <>
            <li>
              <Link to={'/user/' + auth.isAuthenticated().user._id}>
                <Button style={isActive(history, '/user/' + auth.isAuthenticated().user._id)}>My Profile</Button>
              </Link>
            </li>
            <SignoutBtn onClick={() => {
              auth.clearJWT(() => history.push('/'));
            }}>Sign out</SignoutBtn>
          </>}
        </ul>
      </div>
    </div>
  </nav>
))
;

export default Menu;
