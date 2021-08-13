import React, {memo} from 'react';
import './PollStats.css';

const PollsStats = (props) => {
  return (
    <div className='poll-stats-container'>
      <p>
        <em>Polls: {props.polls && props.polls.length}</em>
      </p>
      <p>
        <em>Closed: {props.pollsClosed.length}</em>
      </p>
      {props.polls && props.pollsNew.length > 0 && (
        <p>
          <em>New: {props.pollsNew.length}</em>
        </p>
      )}
    </div>
  );
};

export default memo(PollsStats);
