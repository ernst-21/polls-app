import React, { useEffect, memo } from 'react';
import { Card, Empty, Skeleton, Space, Table, Tag, Grid } from 'antd';
import { useTableFilter } from '../hooks/useTableFilter';
import Poll from './Poll';
import './PollsTable.css';

const {useBreakpoint} = Grid;

const PollsTable = ({ isLoading, setSourceData, sourceData, polls, userId, setCollapsed, setComponent, handleClick, isManaging, showModal, openPoll, closePoll }) => {
  const { getColumnSearchProps } = useTableFilter();
  const screens = useBreakpoint();

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
      render: (record) => <span>{record && <Tag color="green">NEW</Tag>}</span>
    },
    {
      ...getColumnSearchProps('voterNumber'),
      title: 'Voters',
      dataIndex: 'voterNumber',
      key: 'voterNumber'
    },
    {
      ...getColumnSearchProps('isClosed'),
      title: 'Status',
      dataIndex: 'isClosed',
      key: 'isClosed',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space>
          <Tag color={record === 'CLOSED' ? 'volcano' : 'green'}>{record}</Tag>
        </Space>
      )
    },
    !isManaging ?
      {
        title: 'Action',
        key: 'action',
        // eslint-disable-next-line react/display-name
        render: (record) => (
          <Space size="middle">
            {record.hasVoted || record.closed ? (
              <a
                onClick={() => {
                  showAside(record, record.key);
                }}
              >
                View Details
              </a>
            ) : (
              <a
                onClick={() => {
                  showAside(record, record.key);
                }}
              >
                Vote
              </a>
            )}
          </Space>
        )
      } : {
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
    if (!isLoading && polls) {
      setSourceData(
        polls.map((item) => {
          return {
            key: item._id,
            question: item.question,
            voterNumber: item.voters.length,
            voters: item.voters,
            answers: item.answers,
            chosenAnswer: item.chosenAnswer,
            closed: item.closed,
            isClosed: item.closed === false ? 'OPEN' : 'CLOSED',
            isNew: item.voters.length === 0 ? 'NEW' : null,
            hasVoted: item.voters.includes(userId)
          };
        })
      );
    }
  }, [polls, userId, isLoading, setSourceData]);

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
          onClick={(e) => handleClick(e, item.key)}
        />
      </Card>
    );
  };

  return (
    <div className='table-container'>
      <Table
        bordered={true}
        className={screens.xs || screens.sm ? 'table-x' : 'table'}
        columns={columns}
        // eslint-disable-next-line react/display-name
        dataSource={isLoading ? [] : sourceData}
        loaderType="skeleton"
        locale={{
          emptyText: isLoading ? (Array(10).map(item => (
            <Skeleton key={item} paragraph={false} active={true} size="large" />))
          ) : (
            <Empty />
          )
        }}
      />
    </div>

  );
};

export default memo(PollsTable);
