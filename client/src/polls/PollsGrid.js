import React, {memo} from 'react';
import Masonry from 'react-masonry-css';
import Poll from './Poll';
import './PollsGrid.css';

const PollsGrid = (props) => {

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    576: 1
  };

  return (
    <div className="polls-grid-container">
      <Masonry breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {props.polls && props.polls.map((item) => {
          return (
            <Poll
              key={item.key}
              question={item.question}
              chosenAnswer={item.chosenAnswer}
              new={item.voters.length === 0}
              voters={item.voters.length}
              answers={item.answers}
              closed={item.closed}
              voted={item.voters.includes(props.userId)}
              onClick={(e) => props.onClick(e, item._id)}
            />
          );
        })}
      </Masonry>
    </div>


  );
};

export default memo(PollsGrid);
