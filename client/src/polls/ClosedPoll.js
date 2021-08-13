import React from 'react';
import { Badge, Card, Divider, Progress } from 'antd';
import PollTitle from './PollTitle';

export const ClosedPoll = (props) => {
  return (
    <Badge.Ribbon text='CLOSED' color='#e63b19'>
      <Card className='poll-card'>
        <div>
          <PollTitle level={3} title={props.question} />
          <Divider />
          <div>
            {props.answers.map((answer) => (
              <React.Fragment key={answer}>
                <p>{answer}</p>
                <Progress percent={props.percentProgress(answer)} />
              </React.Fragment>
            ))}
          </div>
          <Divider />
        </div>
        <p><em>voters: {props.voters}</em></p>
      </Card>
    </Badge.Ribbon>
  );
};
