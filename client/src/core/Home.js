import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'antd';

const Hello = () => {
  return (
    <div className='home-container' style={{display: 'flex', border: ' 1px solid red'}}>
      <div className='text-container' style={{border: ' 1px solid blue', width: '50%'}}>
        <h1>Text here</h1>
        <Link to="/polls">
          <Button type='primary'>View Polls</Button>
        </Link>
      </div>
      <div className='photo-container'  style={{border: '1px solid green', width: '50%'}}>
        Photo here
      </div>
    </div>
  );
};

export default Hello;
