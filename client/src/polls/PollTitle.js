import React from 'react';
import {Typography} from 'antd';

const {Title} =Typography;

const PollTitle = ({ title }) => {
  return (
    <Title level={3}>{title}</Title>
  );
};

export default PollTitle;
