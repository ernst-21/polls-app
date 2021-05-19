import React, { useState, useEffect } from 'react';
import { list, vote } from './api-polls';
import {Redirect} from 'react-router-dom';
import { Col, Table, Row, Space, Card, message, Tag, Skeleton, Empty, Spin } from 'antd';
import { BarsOutlined, AppstoreOutlined, AppstoreFilled  } from '@ant-design/icons';
import Poll from './Poll';
import SideBar from '../core/SideBar';
import auth from '../auth/auth-helper';
import { useHttpError } from '../hooks/http-hook';
import {useTableFilter} from '../hooks/useTableFilter';

const isActive = (active) => {
  if (active)
    return { color: '#2035f6', fontSize: '26px', marginLeft: '1rem' };
  else
    return { color: '#1890FF', fontSize: '26px', marginLeft: '1rem' };
};

const PollsView = () => {
  const jwt = auth.isAuthenticated();
  const {getColumnSearchProps} = useTableFilter();
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userId, setUserId] = useState('');
  const [component, setComponent] = useState(null);
  const [polls, setPolls] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [redirectToNetErrror, setRedirectToNetError] = useState(false);
  const [barsInActive, setBarsInActive] = useState(true);
  const { error, showErrorModal, httpError } = useHttpError();

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else if (data) {
        setPolls(data);
        setIsLoading(false);
      } else if (!data) {
        setRedirectToNetError(true);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (jwt) {
      setUserId(auth.isAuthenticated().user._id);
    }
  }, [jwt, component]);

  useEffect(() => {
    if (!isLoading) {
      setSourceData(polls.reverse().map(item => {
        return {
          key: item._id,
          question: item.question,
          voterNumber: item.voters.length,
          voters: item.voters,
          answers: item.answers,
          chosenAnswer: item.chosenAnswer,
          closed: item.closed,
          isClosed: item.closed  ===  false ? 'OPEN' : 'CLOSED',
          isNew: item.voters.length === 0 ? 'NEW' : null,
          hasVoted: item.voters.includes(userId)
        };
      }));
    }
  }, [polls, userId, isLoading]);

  const pollsClosed = polls.filter(item => item.closed === true);
  const pollsNew = polls.filter(item => item.voters.length === 0);

  const showAside = (item) => {
    setCollapsed(true);
    setComponent(
      <Card style={{ display: 'block' }}>
        <Poll
          style={{ width: 90 }}
          question={item.question}
          chosenAnswer={item.chosenAnswer}
          new={item.voters.length === 0}
          voters={item.voters.length}
          answers={item.answers}
          closed={item.closed}
          voted={item.voters.includes(userId)}
          onClick={(e) =>handleClick(e, item.key)}
        />
      </Card>
    );
  };

  const handleClick = (e, id) => {
    e.preventDefault;
    const value = e.target.value;
    submitVote(id, value);
    setCollapsed(false);
  };

  const columns = [
    {
      ...getColumnSearchProps('question'),
      title: 'Polls',
      dataIndex: 'question',
      key: 'question',
    },
    {
      ...getColumnSearchProps('isNew'),
      title: 'New',
      dataIndex: 'isNew',
      key: 'isNew',
      // eslint-disable-next-line react/display-name
      render: record => (
        <span>
          {record && <Tag color='green'>
            NEW
          </Tag>}
        </span>
      ),

    },
    {
      title: 'Voters',
      dataIndex: 'voterNumber',
      key: 'voterNumber',
    },
    {
      ...getColumnSearchProps('isClosed'),
      title: 'Status',
      dataIndex: 'isClosed',
      key: 'isClosed',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space>
          <Tag color={record === 'CLOSED' ? 'volcano' : 'green'}>
            {record}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space size="middle">
          {record.hasVoted || record.closed ? (<a onClick={() => {
            showAside(record, record.key);
          }}>View Details</a>) : (
            <a onClick={() => {
              showAside(record, record.key);
            }}>Vote</a>)}
        </Space>
      )
    }
  ];

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const success = (msg) => {
    message.success(msg);
  };



  const submitVote = (id, value) => {
    setIsLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;
    const user = {
      userId: userId,
      chosenAnswer: value
    };
    vote(
      {
        pollId: id
      },
      {
        t: jwt.token
      },
      user
    ).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        list(signal).then((data) => {
          if (data && data.error) {
            console.log(data.error);
          } else if (data) {
            setPolls(data);
            setIsLoading(false);
          } else if (!data) {
            setRedirectToNetError(true);
          }
        });
        success('Poll successfully voted.');
      }
    });
  };

  if (redirectToNetErrror) {
    return <Redirect to='/info-network-error'/>;
  }

  return (
    <>
      <div>
        <div>
          <>
            <BarsOutlined
              style={isActive(!barsInActive)}
              onClick={() => setBarsInActive(false)}
            />
          </>
          <>
            {barsInActive ? (<AppstoreFilled
              style={isActive(barsInActive)}
              onClick={() => {
                setBarsInActive(true);
                setCollapsed(false);
              }} />) : (<AppstoreOutlined
              style={isActive(barsInActive)}
              onClick={() => {
                setBarsInActive(true);
                setCollapsed(false);
              }} />)}
          </>
          <div style={{display:'flex', float: 'right', marginRight: '2rem'}}>
            <p style={{marginRight: '2rem'}}><em>{polls.length} polls</em></p>
            <p style={{marginRight: '2rem'}}><em>{pollsClosed.length} closed</em></p>
            {(polls && pollsNew.length > 0) && <p style={{marginRight: '2rem'}}><em>{pollsNew.length} new</em></p>}
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {barsInActive ? (!isLoading ? <Row style={{ display: 'flex', justifyContent: 'center' }} gutter={[24, 32]}>
            {polls.reverse().map(item => {
              return <Col key={item._id} className="gutter-row" span={7}><Poll
                question={item.question}
                chosenAnswer={item.chosenAnswer}
                new={item.voters.length === 0}
                voters={item.voters.length}
                answers={item.answers}
                closed={item.closed}
                voted={item.voters.includes(userId)}
                onClick={(e) =>handleClick(e, item._id)}
              /></Col>;
            })}
          </Row> : <Spin />) : (<Table
            columns={columns}
            // eslint-disable-next-line react/display-name
            dataSource={isLoading ? [] : sourceData}
            loaderType='skeleton'
            locale={{
              emptyText: isLoading ? <Skeleton paragraph={false} active={true} size='large' /> : <Empty />
            }}
          />)}
        </div>
      </div>
      <SideBar
        isSidebarOpen={collapsed}
        component={component}
        onClick={() => setCollapsed(false)}
      />
    </>
  );
};

export default PollsView;
