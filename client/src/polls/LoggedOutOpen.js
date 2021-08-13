import React from 'react';
import { Card, Divider } from 'antd';
import { Link } from 'react-router-dom';
import PollTitle from './PollTitle';

const LoggedOutOpen = (props) => {
  return (
    <Card className='poll-card'>
      <div>
        <PollTitle title={props.question} />
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to='/signin'>SIGN IN TO VOTE</Link>
        </div>
        <Divider />
      </div>
      <p><em>voters: {props.voters}</em></p>
    </Card>
  );
};

export default LoggedOutOpen;
