import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { list, vote } from './api-polls';
import { Redirect } from 'react-router-dom';
import { Grid } from 'antd';
import SpinLoader from '../components/SpinLoader';
import { success } from '../components/Message';
import SideDrawer from '../core/SideDrawer';
import AboveListBar from '../core/AboveListBar';
import PollsGrid from './PollsGrid';
import PollsTable from './PollsTable';
import PollsStats from './PollsStats';
import PollsViewSelection from './PollsViewSelection';
import auth from '../auth/Auth-User/auth-helper';
import './PollsView.css';

const {useBreakpoint} = Grid;

const PollsView = () => {
  const jwt = auth.isAuthenticated();
  const [collapsed, setCollapsed] = useState(false);
  const [userId, setUserId] = useState('');
  const [component, setComponent] = useState(null);
  const [pollsClosed, setPollsClosed] = useState([]);
  const [pollsNew, setPollsNew] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [barsInActive, setBarsInActive] = useState(true);
  const screens = useBreakpoint();

  const { data: polls = [], isLoading, isError } = useQuery('polls', () => list().then(res => res.json()).then(data => data.reverse()));

  const queryClient = useQueryClient();

  const { mutate } = useMutation(([id, value]) => vote({ pollId: id }, { t: jwt.token }, {
    userId: userId,
    chosenAnswer: value
  }).then(res => res.json()), {
    onSuccess: () => {
      queryClient.invalidateQueries('polls');
      success('Poll successfully voted ');
    }
  });

  useEffect(() => {
    if (jwt) {
      setUserId(auth.isAuthenticated().user._id);
    }
  }, [jwt]);

  useEffect(() => {
    if (polls && polls.length > 0) {
      setPollsClosed(polls.filter((item) => item.closed === true));
      setPollsNew(polls.filter((item) => item.voters.length === 0));
    }
  }, [polls]);


  const handleClick = (e, id) => {
    e.preventDefault;
    const value = e.target.value;
    if (value) {
      mutate([id, value]);
      setCollapsed(false);
    }
  };

  if (isError) {
    return <Redirect to="/info-network-error" />;
  }

  const closeDrawer = () => {
    setCollapsed(false);
  };

  return (
    <div className="polls">
      <AboveListBar>
        <PollsViewSelection
          barsInActive={barsInActive}
          setBarsInActive={setBarsInActive}
          setCollapsed={setCollapsed}
        />
        <PollsStats
          polls={polls}
          pollsClosed={pollsClosed}
          pollsNew={pollsNew}
        />
      </AboveListBar>
      <div className="polls-container">
        {barsInActive ? (
          !isLoading ? (
            <PollsGrid polls={polls} onClick={handleClick} userId={userId} />
          ) : (
            <SpinLoader />
          )
        ) : (
          <PollsTable
            isLoading={isLoading}
            sourceData={sourceData}
            setCollapsed={setCollapsed}
            setComponent={setComponent}
            handleClick={handleClick}
            userId={userId}
            setSourceData={setSourceData}
            polls={polls}
          />
        )}
      </div>
      <SideDrawer
        title='Poll Details'
        placement='right'
        width={screens.xs === true ? '100%' : '45%'}
        isSideDrawerOpen={collapsed}
        onDrawerClose={closeDrawer}
        component={component}
      />
    </div>
  );
};

export default PollsView;
