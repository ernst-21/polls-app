import React, {memo} from 'react';
import {Card, Typography} from 'antd';
import {Link} from 'react-router-dom';
import {CloseCircleTwoTone} from '@ant-design/icons';

const {Title} = Typography;

const InfoError = () => {
  return (
    <Card title='Info' extra={<Link to='/'>Back to Home</Link>} className='card'>
      <Title level={2}>Network Error  <CloseCircleTwoTone twoToneColor="#ff1d0d" /></Title>
      <p style={{fontSize: '15px'}}>It appears to be a problem with your Internet connection. Get in contact with your internet provider or try again later</p>
    </Card>
  );
};

export default memo(InfoError);
