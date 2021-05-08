import React from 'react';
import {Typography, Progress, Card, Divider, Radio, Button } from 'antd';

const {Title} = Typography;

const Poll = (props) => {
  return (
    <Card>
      <div>
        <Title level={3}>{props.question}</Title>
        <Divider />
        <div style={{marginTop: '0.5rem'}}>
          <p>Yes</p>
          <Progress percent={props.yesPct} />
          <p>No</p>
          <Progress percent={props.noPct} />
        </div>
        <Divider />
        <Radio.Group onChange={props.onChange} value={props.value}>
          <Radio value='yes'>Yes</Radio>
          <Radio value='no'>No</Radio>
        </Radio.Group>
        <Button onClick={props.onClick}>Vote</Button>
      </div>
    </Card>
  );
};

export default Poll;
