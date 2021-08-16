import React, { memo, useEffect } from 'react';
import { Empty, Skeleton, Space, Table, Grid } from 'antd';
import { useTableFilter } from '../../hooks/useTableFilter';
import '../../core/Stats.css';
import '../../core/Table.css';

const {useBreakpoint} = Grid;

const UsersTable = ({ isLoading, setSourceData, users, showModal, viewProfile, sourceData }) => {
  const { getColumnSearchProps } = useTableFilter();
  const screens = useBreakpoint();

  useEffect(() => {
    if (!isLoading) {
      setSourceData(users.map(item => {
        return {
          key: item._id,
          name: item.name,
          email: item.email,
          role: item.role
        };
      }));
    }
  }, [users, isLoading, setSourceData]);

  const columns = [
    {
      ...getColumnSearchProps('name'),
      title: 'Name',
      dataIndex: 'name',
      key: 'name'

    },
    {
      ...getColumnSearchProps('email'),
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      ...getColumnSearchProps('role'),
      title: 'Role',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space size="middle">
          {record.role !== 'admin' && <>
            <a onClick={() => showModal(record.key)}>Delete</a>
            <a onClick={() => viewProfile(record.key)}>View</a>
          </>}
        </Space>
      )
    }
  ];

  return (
    <div className='table-container'>
      <Table
        dataSource={isLoading ? [] : sourceData}
        columns={columns} loaderType='skeleton'
        bordered={true}
        className={screens.xs || screens.sm ? 'table-x' : 'table'}
        locale={{
          emptyText: isLoading ? <Skeleton paragraph={false} active={true} size='large' /> : <Empty />
        }} />
    </div>
  );
};

export default memo(UsersTable);
