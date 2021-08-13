import React, { useState, useEffect, useRef } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import auth from '../auth/Auth-User/auth-helper';
import { read } from './api-user';
import { Typography, Card, Avatar, Spin } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import DeleteUser from './DeleteUser';

const { Title } = Typography;

const Profile = (props) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [redirectToNetError, setRedirectToNetError] = useState(false);
  const jwt = auth.isAuthenticated();
  const userId = useParams().userId;
  const nodeRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({
      userId: userId || props.userId
    }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else if (data) {
        setUser(data);
        setIsLoading(false);
      } else if (!data) {
        setRedirectToNetError(true);
        setIsLoading(false);
      }
    });

    return function cleanup() {
      abortController.abort();
    };

  }, [userId, jwt.token, props.userId]);

  if (auth.isAuthenticated() && redirectToSignin) {
    return <Redirect to='/' />;
  } else if (redirectToSignin) {
    return <Redirect to='/signin' />;
  }

  if (redirectToNetError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <>
      {isLoading ? (<Spin />) : (<Card className='card'
        style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
      >
        <Title level={3}>Profile</Title>
        <Avatar size={150} src={user.pic} icon={<UserOutlined />} />
        <Title level={2}>{user.name}</Title>
        {((auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id)
          ||
          (auth.isAuthenticated().user && auth.isAuthenticated().user._id !== props.userId && auth.isAuthenticated().user.role === 'admin')) &&
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>{user.email}</Title>
          {auth.isAuthenticated().user.role !== 'admin' ?
            (<Link to={'/user/edit/' + user._id}>
              <EditOutlined style={{ fontSize: '1.5rem' }} />
              <h4>Edit</h4>
            </Link>)
            :
            (window.location.pathname === `/user/${user._id}` && auth.isAuthenticated().user.role === 'admin' ? (
              <Link to={'/user/edit-user/' + user._id}>
                <EditOutlined style={{ fontSize: '1.5rem' }} />
                <h4>Edit</h4>
              </Link>) : (<a onClick={props.editProfile} ref={nodeRef}>
              <EditOutlined style={{ fontSize: '1.5rem' }} />
              <h4>Edit</h4>
            </a>))
          }
          <DeleteUser userId={user._id || props.userId} />
        </div>}
      </Card>)}
    </>
  );
};

export default Profile;
