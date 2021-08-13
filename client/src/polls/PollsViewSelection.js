import React from 'react';
import {
  AppstoreFilled,
  AppstoreOutlined,
  BarsOutlined
} from '@ant-design/icons';

const isActive = (active) => {
  if (active) return { color: '#16027a', fontSize: '26px', marginLeft: '1rem' };
  else return { color: '#1890FF', fontSize: '26px', marginLeft: '1rem' };
};

const PollsViewSelection = (props) => {
  return (
    <div>
      <>
        <BarsOutlined
          style={isActive(!props.barsInActive)}
          onClick={() => props.setBarsInActive(false)}
        />
      </>
      <>
        {props.barsInActive ? (
          <AppstoreFilled
            style={isActive(props.barsInActive)}
            onClick={() => {
              props.setBarsInActive(true);
              props.setCollapsed(false);
            }}
          />
        ) : (
          <AppstoreOutlined
            style={isActive(props.barsInActive)}
            onClick={() => {
              props.setBarsInActive(true);
              props.setCollapsed(false);
            }}
          />
        )}
      </>
    </div>
  );
};

export default PollsViewSelection;
