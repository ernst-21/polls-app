import React from 'react';
import { Input } from 'antd';
import Fuse from 'fuse.js';
import {useQueryClient} from 'react-query';

import './PollsView.css';

const PollsSearchBar = (props) => {

  const queryClient = useQueryClient();

  const searchData = (pattern) => {
    if (!pattern) {
      queryClient.invalidateQueries('polls');
      return;
    }

    const fuse = new Fuse(props.polls, {
      keys: ['question'],
    });

    const result = fuse.search(pattern);
    const matches = [];
    if (!result.length) {
      queryClient.invalidateQueries('polls');
    } else {
      result.forEach(({item}) => {
        matches.push(item);
      });
      queryClient.setQueryData(['polls'], matches);
    }
  };

  return (
    <div className="search-bar-container">
      <Input
        className="poll-card-search-bar"
        onChange={e => searchData(e.target.value)}
        placeholder="search polls"
      />
    </div>
  );
};

export default PollsSearchBar;
