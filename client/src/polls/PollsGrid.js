import React, {memo} from 'react';
import { Col, Row } from 'antd';
import Poll from './Poll';
import './PollsGrid.css';

const PollsGrid = (props) => {
  return (
    <div className="polls-grid-container">
      <Row className="polls-grid" gutter={[16, 16]}>
        {props.polls && props.polls.map((item) => {
          return (
            <Col xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              xl={{ span: 8 }} key={item._id} className="gutter-row">
              <Poll
                question={item.question}
                chosenAnswer={item.chosenAnswer}
                new={item.voters.length === 0}
                voters={item.voters.length}
                answers={item.answers}
                closed={item.closed}
                voted={item.voters.includes(props.userId)}
                onClick={(e) => props.onClick(e, item._id)}
              />
            </Col>
          );
        })}
      </Row>
    </div>


  );
};

export default memo(PollsGrid);
