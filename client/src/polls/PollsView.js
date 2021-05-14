import React, { useState, useEffect } from 'react';
import { list, vote } from './api-polls';
import { Col, Table, Row, Space, Card, message } from 'antd';
import { BarsOutlined, AppstoreOutlined, AppstoreFilled } from '@ant-design/icons';
import Poll from './Poll';
import SideBar from '../core/SideBar';
import auth from '../auth/auth-helper';
import { useHttpError } from '../hooks/http-hook';

const isActive = (active) => {
  if (active)
    return { color: '#2035f6', fontSize: '26px', marginLeft: '1rem' };
  else
    return { color: '#1890FF', fontSize: '26px', marginLeft: '1rem' };
};

const PollsView = () => {
  const jwt = auth.isAuthenticated();
  const [collapsed, setCollapsed] = useState(false);
  const [userId, setUserId] = useState('');
  const [component, setComponent] = useState(null);
  const [polls, setPolls] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [barsInActive, setBarsInActive] = useState(true);
  const { error, showErrorModal, httpError } = useHttpError();

  useEffect(() => {
    if (jwt) {
      setUserId(auth.isAuthenticated().user._id);
    }
  }, [jwt, component]);

  useEffect(() => {
    if (polls.length > 0) {
      setSourceData(polls.map(item => {
        return {
          key: item._id,
          question: item.question,
          voterNumber: item.voters.length,
          voters: item.voters,
          answers: item.answers,
          chosenAnswer: item.chosenAnswer,
          closed: item.closed,
          hasVoted: item.voters.includes(userId)
        };
      }));
    }
  }, [polls, userId]);

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
      title: 'Polls',
      dataIndex: 'question',
      key: 'question'
    },
    {
      title: 'Voters',
      dataIndex: 'voterNumber',
      key: 'voterNumber'
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space size="middle">
          {record.hasVoted ? (<a onClick={() => {
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

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setPolls(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const submitVote = (id, value) => {
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
          } else {
            setPolls(data);
          }
        });
        success('Poll successfully voted.');
      }
    });
  };

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
        </div>
        <div style={{ marginTop: '1rem' }}>
          {barsInActive ? (<Row style={{ display: 'flex', justifyContent: 'center' }} gutter={[24, 32]}>
            {polls.map(item => {
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
          </Row>) : (<Table columns={columns} dataSource={sourceData} />)}
        </div>
      </div>
      {collapsed && <SideBar
        isSidebarOpen={collapsed}
        component={component}
        onClick={() => setCollapsed(false)}
      />}
    </>
  );
};

export default PollsView;
