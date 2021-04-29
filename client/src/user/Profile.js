import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import auth from '../auth/auth-helper';
import {read} from './api-user';
import { Typography, Card, Avatar, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

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
    <Card style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
      <Title level={3}>Profile</Title>
      <Avatar size={150}><UserOutlined style={{fontSize: '3rem'}}/></Avatar>
      <Title level={2}>{user.name}</Title>
      {auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id && <>
        <Link to={'/user/edit/' + user._id} style={{ textAlign: 'center' }}>
          <EditOutlined style={{ fontSize: '1.5rem' }} />
          <h4>Edit</h4>
        </Link>
        <Button>DELETE</Button>
      </> }
    </Card>
  );
};

export default Profile;
