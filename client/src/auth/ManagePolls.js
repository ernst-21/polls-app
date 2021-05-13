import React, { useEffect, useState } from 'react';
import { close, list, remove } from '../polls/api-polls';
import { Button, Table, Space, message } from 'antd';
import SideBar from '../core/SideBar';
import CreatePoll from './CreatePoll';
import auth from './auth-helper';
import { useHttpError } from '../hooks/http-hook';


const ManagePolls = () => {
  const jwt = auth.isAuthenticated();
  const [polls, setPolls] = useState([]);
  const { error, showErrorModal, httpError } = useHttpError();
  const [collapsed, setCollapsed] = useState(false);
  const [component, setComponent] = useState(null);
  const [sourceData, setSourceData] = useState([]);

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const success = (msg) => {
    message.success(msg);
  };

  const deletePoll = (id) => {
    remove({pollId: id}, { t: jwt.token } ).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        location.reload();
        success('Poll deleted');
      }
    });
  };

  const closePoll = (id) => {
    close({pollId: id}, { t: jwt.token } ).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        location.reload();
        success('Poll closed');
      }
    });
  };

  const columns = [
    {
      title: 'Questions',
      dataIndex: 'questions',
      key: 'questions',

    },
    {
      title: 'Voters',
      dataIndex: 'voters',
      key: 'voters'
    },
    {
      title: 'Closed',
      dataIndex: 'closed',
      key: 'closed'
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space size="middle">
          <a onClick={() => console.log(record.key)}>Edit</a>
          <a onClick={() => deletePoll(record.key)}>Delete</a>
          <a onClick={() => closePoll(record.key)}>Close</a>
        </Space>
      )
    }
  ];

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

  useEffect(() => {
    if (polls.length > 0) {
      setSourceData(polls.map(item => {
        return {
          key: item._id,
          questions: item.question,
          voters: item.voters.length,
          closed: item.closed.toString().toUpperCase()
        };
      }));
    }
  }, [polls]);

  const showAside = () => {
    setCollapsed(true);
    setComponent(<CreatePoll />);
  };

  return (
    <>
      <div>
        <Button type='primary' onClick={showAside}>CREATE</Button>
        <Table columns={columns} dataSource={sourceData} />
      </div>
      {collapsed && <SideBar
        isSidebarOpen={collapsed}
        component={component}
        onClick={() => setCollapsed(false)}
      />}
    </>
  );
};

export default ManagePolls;
