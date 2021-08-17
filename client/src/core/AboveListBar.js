import React, {memo} from 'react';
import './AboveListBar.css';

const AboveListBar = (props) => {
  return (
    <div className='table-views_stats'>
      {props.children}
    </div>
  );
};

export default memo(AboveListBar);
