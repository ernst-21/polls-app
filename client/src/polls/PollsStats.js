import React, {memo} from 'react';
import '../core/Stats.css';

const PollsStats = (props) => {
  return (
    <div className='stats-container'>
      <p>
        <strong>Polls: {props.polls && props.polls.length}</strong>
      </p>
      <p>
        <strong>Closed: {props.pollsClosed.length}</strong>
      </p>
      {props.polls && props.pollsNew.length > 0 && (
        <p>
          <strong>New: {props.pollsNew.length}</strong>
        </p>
      )}
    </div>
  );
};

export default memo(PollsStats);
