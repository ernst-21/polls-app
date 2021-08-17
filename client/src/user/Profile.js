import React, { useState, useRef } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import auth from '../auth/Auth-User/auth-helper';
import { read } from './api-user';
import { Typography, Avatar, Spin, Grid } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import DeleteUser from './DeleteUser';
import { useQuery } from 'react-query';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const Profile = (props) => {
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const userId = useParams().userId;
  const nodeRef = useRef();
  const screens = useBreakpoint();

  const { data: user, isLoading, isError, error } = useQuery(
    ['user', userId || props.userId],
    () =>
      read({ userId: userId || props.userId }, { t: jwt.token })
        .then((res) => res.json())
        .then((data) => data),
    { onError: () => setRedirectToSignin(true) }
  );

  if (auth.isAuthenticated() && redirectToSignin) {
    return <Redirect to="/" />;
  } else if (!auth.isAuthenticated()) {
    return <Redirect to="/signin" />;
  }

  if (isError) {
    return <Redirect to="/info-network-error" />;
  }

  if (error) {
    return <Redirect to="/signin" />;
  }

  return (
    <div className="profile-card-container">
      {isLoading ? (
        <Spin />
      ) : (
        <div className={screens.xs === true ? 'profile-drawer-card' : 'profile-card'}>
          <Title level={3}>Profile</Title>
          <Avatar size={130} src={user.pic} icon={<UserOutlined />} />
          <Title level={2}>{user.name}</Title>
          {((auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id === user._id &&
            auth.isAuthenticated().user.role !== 'admin') ||
            (auth.isAuthenticated().user &&
              auth.isAuthenticated().user._id !== props.userId &&
              auth.isAuthenticated().user.role === 'admin')) && (
            <div>
              <Title level={4}>{user.email}</Title>
              {auth.isAuthenticated().user.role !== 'admin' ? (
                <Link to={'/user/edit/' + user._id}>
                  <EditOutlined style={{fontSize: '1.5rem'}} />
                  <h4>Edit</h4>
                </Link>
              ) : window.location.pathname === `/user/${user._id}` &&
                auth.isAuthenticated().user.role === 'admin' ? (
                  <Link to={'/user/edit-user/' + user._id}>
                    <EditOutlined style={{fontSize: '1.5rem'}} />
                    <h4>Edit</h4>
                  </Link>
                ) : (
                  <a onClick={props.editProfile} ref={nodeRef}>
                    <EditOutlined style={{fontSize: '1.5rem'}} />
                    <h4>Edit</h4>
                  </a>
                )}
              <DeleteUser userId={user._id || props.userId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
