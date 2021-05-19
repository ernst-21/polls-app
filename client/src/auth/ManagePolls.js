import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { close, list, remove, open } from '../polls/api-polls';
import { Button, Table, Space, message, Modal, Tag, Skeleton, Empty } from 'antd';
import auth from './auth-helper';
import { useHttpError } from '../hooks/http-hook';
import { useTableFilter } from '../hooks/useTableFilter';


const ManagePolls = () => {
  const jwt = auth.isAuthenticated();
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pollId, setPollId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();
  const [sourceData, setSourceData] = useState([]);
  const { getColumnSearchProps } = useTableFilter();

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
    setIsLoading(true);
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
            setIsLoading(false);
          }
        });
      }
    });
  };

  const closePoll = (id) => {
    setIsLoading(true);
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
            setIsLoading(false);
          }
        });
      }
    });
  };

  const openPoll = (id) => {
    setIsLoading(true);
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
            setIsLoading(false);
          }
        });
      }
    });
  };

  const columns = [
    {
      ...getColumnSearchProps('questions'),
      title: 'Questions',
      dataIndex: 'questions',
      key: 'questions'
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
      )
    },
    {
      title: 'Voters',
      dataIndex: 'voters',
      key: 'voters'
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
      )
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space size="middle">
          <a onClick={() => showModal(record.key)}>Delete</a>
          {record.closed ? (<a onClick={() => openPoll(record.key)}>Open Poll</a>) : (
            <a onClick={() => closePoll(record.key)}>Close Poll</a>)}
        </Space>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setPolls(data);
        setIsLoading(false);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setSourceData(polls.reverse().map(item => {
        return {
          key: item._id,
          questions: item.question,
          voters: item.voters.length,
          closed: item.closed,
          isClosed: item.closed === false ? 'OPEN' : 'CLOSED',
          isNew: item.voters.length === 0 ? 'NEW' : ''
        };
      }));
    }
  }, [polls, isLoading]);

  const showModal = (id) => {
    setPollId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    deletePoll(pollId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const pollsClosed = polls.filter(item => item.closed === true);
  const pollsNew = polls.filter(item => item.voters.length === 0);

  return (
    <>
      <div>
        <Link to='/create-poll'>
          <Button style={{ marginBottom: '1rem' }} type='primary'>CREATE</Button>
        </Link>
        <div style={{display:'flex', float: 'right', marginRight: '2rem'}}>
          <p style={{marginRight: '2rem'}}><em>{polls.length} polls</em></p>
          <p style={{marginRight: '2rem'}}><em>{pollsClosed.length} closed</em></p>
          {(polls && pollsNew.length > 0) && <p style={{marginRight: '2rem'}}><em>{pollsNew.length} new</em></p>}
        </div>
        <Table columns={columns} dataSource={isLoading? [] : sourceData} loaderType='skeleton'
          locale={{
            emptyText: isLoading ? <Skeleton paragraph={false} active={true} size='large' /> : <Empty />
          }} />
        <Modal title="Delete Poll" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <p>By clicking OK this poll will be deleted. This action cannot be undone</p>
        </Modal>
      </div>
    </>
  );
};

export default ManagePolls;
