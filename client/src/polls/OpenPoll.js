import React, { useRef } from 'react';
import { Badge, Card, Divider, Progress, Radio } from 'antd';
import PollTitle from './PollTitle';
import auth from '../auth/Auth-User/auth-helper';

const VotedPoll = (props) => {
  return (
    <>
      <div>
        {props.answers.map(answer => (
          <React.Fragment key={answer}>
            <p style={{marginBottom: 0, marginTop: '1.2rem'}}>{answer}</p>
            <Progress percent={props.percentProgress(answer)} />
          </React.Fragment>
        ))}
      </div>
      <Divider />
    </>
  );
};

const PollToVote = (props) => {
  const tileRef = useRef();
  return (
    (auth.isAuthenticated() && !props.voted && !props.closed) && <>
      <div style={{ display: 'block' }}><Radio.Group onChange={props.onChange}>
        {props.answers.map(answer => (
          <div key={answer}>
            <Radio onClick={props.onClick} style={{ marginBottom: '.8rem' }} ref={tileRef}
              value={answer}>{answer}</Radio>
          </div>
        ))}
      </Radio.Group>
      </div>
    </>
  );
};

const OpenPoll = (props) => {

  return (
    !props.new ? (
      <Card className='poll-card'>
        <div>
          <PollTitle title={props.question} />
          <Divider />
          {props.voted && <VotedPoll percentProgress={props.percentProgress} answers={props.answers} />}
          <PollToVote voted={props.voted} closed={props.closed} onChange={props.onChange} answers={props.answers} onClick={props.onClick} />
        </div>
        <p style={{ marginTop: '1rem' }}><em>voters: {props.voters}</em></p>
      </Card>)
      :
      (<Badge.Ribbon text='NEW' color='#03a31b'><Card className='poll-card'>
        <div>
          <PollTitle title={props.question} />
          <Divider />
          {props.voted && <>
            <VotedPoll percentProgress={props.percentProgress} answers={props.answers} />
          </>}
          <PollToVote voted={props.voted} closed={props.closed} onChange={props.onChange} answers={props.answers} onClick={props.onClick} />
        </div>
        <p style={{ marginTop: '1rem' }}><em>voters: {props.voters}</em></p>
      </Card></Badge.Ribbon>)
  );
};

export default OpenPoll;
