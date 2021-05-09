import React, { useRef } from 'react';
import { Typography, Progress, Card, Divider, Radio, Button } from 'antd';
import auth from '../auth/auth-helper';

const { Title } = Typography;

const Poll = (props) => {
  const tileRef = useRef();

  return (
    <Card>
      <div>
        <Title level={3}>{props.question}</Title>
        <Divider />
        <div style={{ marginTop: '0.5rem' }}>
          <p>Yes</p>
          <Progress percent={props.yesPct} />
          <p>No</p>
          <Progress percent={props.noPct} />
        </div>
        <Divider />
        {(auth.isAuthenticated() && !props.voted) && <><Radio.Group onChange={props.onChange}>
          <Radio ref={tileRef} value='yes'>Yes</Radio>
          <Radio ref={tileRef} value='no'>No</Radio>
        </Radio.Group>
        <Button ref={tileRef} type='primary' onClick={props.onClick}>Vote</Button></>}
      </div>
    </Card>
  );
};

export default Poll;
