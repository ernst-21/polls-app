import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'antd';
import auth from '../auth/Auth-User/auth-helper';
import './Home.css';

const Hello = () => {
  return (
    <div className='home-container'>
      <div className='text-container'>
        <h1>Polls System</h1>
        <p>This is application allows you to see and vote the One-Answer-Telegram-like polls that were published by the admin or the power-user. To vote you will be required to log in or sign up. </p><br/>
        <p>I will also let you give a try as admin so you can perform CRUD operations on polls and users.</p>
        {auth.isAuthenticated() ? null : (<Link to="/signin">
          <Button type='primary' size='large'><span>Sign In</span></Button>
        </Link>)}
      </div>
      <div className='photo-container'>
        <img src="https://res.cloudinary.com/ernst1/image/upload/q_100/v1628879019/Telegram-Polls_agx0je.svg" alt="home=photo" />
      </div>
    </div>
  );
};

export default Hello;
