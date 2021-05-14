import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { close, list, remove, open } from '../polls/api-polls';
import { Button, Table, Space, message } from 'antd';
import auth from './auth-helper';
import { useHttpError } from '../hooks/http-hook';


const ManagePolls = () => {
  const jwt = auth.isAuthenticated();
  const [polls, setPolls] = useState([]);
  const { error, showErrorModal, httpError } = useHttpError();
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
    const abortController = new AbortController();
    const signal = abortController.signal;
    remove({ pollId: id }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        success('Poll deleted');
        list(signal).then((data) => {
          if (data && data.error) {
            console.log(data.error);
          } else {
            setPolls(data);
          }
        });
      }
    });
  };

  const closePoll = (id) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    close({ pollId: id }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        success('Poll closed');
        list(signal).then((data) => {
          if (data && data.error) {
            console.log(data.error);
          } else {
            setPolls(data);
          }
        });
      }
    });
  };

  const openPoll = (id) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    open({ pollId: id }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        success('Poll open');
        list(signal).then((data) => {
          if (data && data.error) {
            console.log(data.error);
          } else {
            setPolls(data);
          }
        });
      }
    });
  };

  const columns = [
    {
      title: 'Questions',
      dataIndex: 'questions',
      key: 'questions'

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
          <a onClick={() => deletePoll(record.key)}>Delete</a>
          {record.isClosed ? (<a onClick={() => openPoll(record.key)}>Open Poll</a>) : (<a onClick={() => closePoll(record.key)}>Close</a>)}

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
          closed: item.closed.toString().toUpperCase(),
          isClosed: item.closed
        };
      }));
    }
  }, [polls]);

  return (
    <>
      <div>
        <Link to='/create-poll'>
          <Button style={{ marginBottom: '1rem' }} type='primary'>CREATE</Button>
        </Link>
        <Table columns={columns} dataSource={sourceData} />
      </div>
    </>
  );
};

export default ManagePolls;
