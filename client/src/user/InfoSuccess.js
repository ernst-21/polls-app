import React, {memo} from 'react';
import {Card, Typography} from 'antd';
import {Link} from 'react-router-dom';
import {CheckCircleTwoTone} from '@ant-design/icons';

const {Title} = Typography;

const InfoSuccess = () => {
  return (
    <Card title='Info' extra={<Link to='/'>Back to Home</Link>} className='card'>
      <Title level={2}>Email successfully sent  <CheckCircleTwoTone twoToneColor="#52c41a" /></Title>
      <p style={{fontSize: '15px'}}>We have sent you a link to you your given email account. Please check your email to retrieve your password.</p>
    </Card>
  );
};

export default memo(InfoSuccess);
