import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Modal, Card, Skeleton, Empty } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Profile from '../../user/Profile';
import { Redirect } from 'react-router-dom';
import EditUserProfile from './EditUserProfile';
import auth from './auth-helper';
import { listUsers, removeUser } from '../../user/api-user';
import { Link } from 'react-router-dom';
import SideDrawer from '../../core/SideDrawer';
import { useTableFilter } from '../../hooks/useTableFilter';
import { success } from '../../components/Message';

const ManageUsers = () => {
  const jwt = auth.isAuthenticated();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [component, setComponent] = useState(null);
  const [sourceData, setSourceData] = useState([]);
  const { getColumnSearchProps } = useTableFilter();

  const { data: users = [], isLoading, isError } = useQuery('users', () => listUsers().then(res => res.json()).then(data => data));

  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation((id) => removeUser({ userId: id }, { t: jwt.token }), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      success('User successfully deleted');
    }
  });

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
  }, [users, isLoading]);

  const editUser = (id) => {
    setCollapsed(true);
    setComponent(<Card><EditUserProfile closeSideBar={() => setCollapsed(false)} userId={id} /></Card>);
  };

  const viewProfile = (id) => {
    setCollapsed(true);
    setComponent(<Card><Profile userId={id} editProfile={() => editUser(id)} /></Card>);
  };

  const showModal = (id) => {
    setUserId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    deleteMutation(userId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
            <a onClick={() => editUser(record.key)}>Edit</a>
          </>}
          <a onClick={() => viewProfile(record.key)}>View</a>
        </Space>
      )
    }
  ];

  if (isError) {
    return <Redirect to='/info-network-error' />;
  }

  const closeDrawer = () => {
    setCollapsed(false);
  };

  return (
    <div>
      <Link to='/create-user'>
        <Button style={{ marginBottom: '1rem' }} type='primary'>CREATE</Button>
      </Link>
      <p style={{ float: 'right', marginRight: '2rem' }}><em>{users.length} users</em></p>
      <Table
        dataSource={isLoading ? [] : sourceData}
        columns={columns} loaderType='skeleton'
        locale={{
          emptyText: isLoading ? <Skeleton paragraph={false} active={true} size='large' /> : <Empty />
        }} />
      <Modal title="Delete User" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>By clicking OK your account will be deleted. This action cannot be undone</p>
      </Modal>
      <SideDrawer width={650} isSideDrawerOpen={collapsed}
        onDrawerClose={closeDrawer}
        component={component}
      />
    </div>
  );
};

export default ManageUsers;
