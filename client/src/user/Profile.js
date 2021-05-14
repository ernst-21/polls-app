import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import auth from '../auth/auth-helper';
import {read} from './api-user';
import { Typography, Card, Avatar } from 'antd';
import { UserOutlined,EditOutlined } from '@ant-design/icons';
import DeleteUser from './DeleteUser';

const {Title} = Typography;

const Profile = () => {
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const userId = useParams().userId;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({
      userId: userId
    }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };

  }, [userId, jwt.token]);

  if (auth.isAuthenticated() && redirectToSignin) {
    return <Redirect to='/' />;
  } else if (redirectToSignin) {
    return <Redirect to='/signin' />;
  }


  return (
    <Card className='card' style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
      <Title level={3}>Profile</Title>
      <Avatar size={150} src={user.pic} icon={<UserOutlined />} />
      <Title level={2}>{user.name}</Title>
      {((auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id) || (auth.isAuthenticated().user && auth.isAuthenticated().user._id !== user._id && auth.isAuthenticated().user.role === 'admin')) && <div style={{ textAlign: 'center'}}>
        <Title level={3}>{user.email}</Title>
        <Link to={auth.isAuthenticated().user.role !== 'admin' ? '/user/edit/' + user._id : '/user/edit-user/' + user._id}>
          <EditOutlined style={{ fontSize: '1.5rem' }} />
          <h4>Edit</h4>
        </Link>
        <DeleteUser userId={user._id}/>
      </div> }
    </Card>
  );
};

export default Profile;
