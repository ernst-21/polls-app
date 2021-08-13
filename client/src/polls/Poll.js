import React from 'react';
import auth from '../auth/Auth-User/auth-helper';
import LoggedOutOpen from './LoggedOutOpen';
import { ClosedPoll } from './ClosedPoll';
import OpenPoll from './OpenPoll';


const Poll = (props) => {
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  const percentProgress = (answ) => {
    return Math.round(countOccurrences(props.chosenAnswer, answ) / props.voters * 100);
  };

  if (!auth.isAuthenticated() && !props.closed) {
    return (
      <LoggedOutOpen question={props.question} voters={props.voters} />
    );
  } else {
    return (
      <>
        {props.closed ? (
          <ClosedPoll answers={props.answers} question={props.question} percentProgress={percentProgress}
            voters={props.voters} />) : (
          <OpenPoll new={props.new} question={props.question} percentProgress={percentProgress} answers={props.answers}
            voted={props.voted} closed={props.closed} voters={props.voters} onChange={props.onChange}
            onClick={props.onClick} />)}</>
    );
  }
};

export default Poll;
