import React, {memo} from 'react';

const UsersStats = (props) => {
  return (
    <div className='poll-stats-container'>
      <p>
        <strong>Users: {props.users && props.users.length}</strong>
      </p>
    </div>
  );
};

export default memo(UsersStats);
