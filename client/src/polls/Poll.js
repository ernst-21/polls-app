import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Progress, Card, Divider, Radio, Badge } from 'antd';
import auth from '../auth/auth-helper';

const { Title } = Typography;

const Poll = (props) => {
  const tileRef = useRef();

  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  const percentProgress = (answ) => {
    return Math.round(countOccurrences(props.chosenAnswer, answ) / props.voters * 100);
  };

  if (!auth.isAuthenticated() && !props.closed) {
    return (
      <Card className='poll-card'>
        <div>
          <Title level={3}>{props.question}</Title>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to='/signin'>SIGN IN TO VOTE</Link>
          </div>
          <Divider />
        </div>
        <p><em>voters: {props.voters}</em></p>
      </Card>
    );
  } else {
    return (
      <>
        {props.closed ? (<Badge.Ribbon text='CLOSED' color='#e63b19'>
          <Card className='poll-card'>
            <div>
              <Title level={3}>{props.question}</Title>
              <Divider />
              <div>
                {props.answers.map((answer) => (
                  <React.Fragment key={answer}>
                    <p>{answer}</p>
                    <Progress percent={percentProgress(answer)} />
                  </React.Fragment>
                ))}
              </div>
              <Divider />
            </div>
            <p><em>voters: {props.voters}</em></p>
          </Card>
        </Badge.Ribbon>) : (!props.new ? (<Card className='poll-card'>
          <div>
            <Title level={3}>{props.question}</Title>
            <Divider />
            {props.voted && <>
              <div>
                {props.answers.map(answer => (
                  <React.Fragment key={answer}>
                    <p>{answer}</p>
                    <Progress percent={percentProgress(answer)} />
                  </React.Fragment>
                ))}
              </div>
              <Divider />
            </>}
            {(auth.isAuthenticated() && !props.voted && !props.closed) && <>
              <div style={{ display: 'block' }}><Radio.Group onChange={props.onChange}>
                {props.answers.map(answer => (
                  <div key={answer}>
                    <Radio onClick={props.onClick} style={{ marginBottom: '.8rem' }} ref={tileRef}
                      value={answer}>{answer}</Radio>
                  </div>
                ))}
              </Radio.Group>
              </div>
            </>}
          </div>
          <p style={{ marginTop: '1rem' }}><em>voters: {props.voters}</em></p>
        </Card>)
          :
          (<Badge.Ribbon text='NEW' color='#03a31b'><Card className='poll-card'>
            <div>
              <Title level={3}>{props.question}</Title>
              <Divider />
              {props.voted && <>
                <div>
                  {props.answers.map(answer => (
                    <React.Fragment key={answer}>
                      <p>{answer}</p>
                      <Progress
                        percent={percentProgress(answer)} />
                    </React.Fragment>
                  ))}
                </div>
                <Divider />
              </>}
              {(auth.isAuthenticated() && !props.voted && !props.closed) && <>
                <div style={{ display: 'block' }}><Radio.Group onChange={props.onChange}>
                  {props.answers.map(answer => (
                    <div key={answer}>
                      <Radio onClick={props.onClick} style={{ marginBottom: '.8rem' }} ref={tileRef}
                        value={answer}>{answer}</Radio>
                    </div>
                  ))}
                </Radio.Group>
                </div>
              </>}
            </div>
            <p style={{ marginTop: '1rem' }}><em>voters: {props.voters}</em></p>
          </Card></Badge.Ribbon>))}</>
    );
  }


};

export default Poll;
