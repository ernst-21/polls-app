import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Modal, message, Card } from 'antd';
import Profile from '../user/Profile';
import EditUserProfile from './EditUserProfile';
import auth from './auth-helper';
import { useHttpError } from '../hooks/http-hook';
import { list, removeUser } from '../user/api-user';
import { Link } from 'react-router-dom';
import SideBar from '../core/SideBar';
import {useTableFilter} from '../hooks/useTableFilter';

const ManageUsers = () => {
  const jwt = auth.isAuthenticated();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [component, setComponent] = useState(null);
  const { error, showErrorModal, httpError } = useHttpError();
  const [sourceData, setSourceData] = useState([]);
  const {getColumnSearchProps} = useTableFilter();

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
        setUsers(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setSourceData(users.map(item => {
        return {
          key: item._id,
          name: item.name,
          email: item.email,
          role: item.role
        };
      }));
    }
  }, [users]);

  const deleteUser = (id) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    removeUser({ userId: id }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        console.log(data);
        success('User deleted');
        list(signal).then((data) => {
          if (data && data.error) {
            console.log(data.error);
          } else {
            setUsers(data);
          }
        });
      }
    });
  };

  const editUser = (id) => {
    setCollapsed(true);
    setComponent(<Card><EditUserProfile closeSideBar={() => setCollapsed(false)} userId={id} /></Card>);
  };

  const viewProfile = (id) => {
    setCollapsed(true);
    setComponent(<Card><Profile userId={id} editProfile={() => editUser(id)}/></Card>);
  };

  const showModal = (id) => {
    setUserId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    deleteUser(userId);
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
          <a onClick={() => showModal(record.key)}>Delete</a>
          <a onClick={() => editUser(record.key)}>Edit</a>
          <a onClick={() => viewProfile(record.key)}>View</a>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Link to='/create-user'>
        <Button style={{ marginBottom: '1rem' }} type='primary'>CREATE</Button>
      </Link>
      <Table dataSource={sourceData} columns={columns} />
      <Modal title="Delete User" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>By clicking OK your account will be deleted. This action cannot be undone</p>
      </Modal>
      {collapsed && <SideBar
        style={{height: '100vh', witdth: '45%', overflow: 'hidden'}}
        isSidebarOpen={collapsed}
        component={component}
        onClick={() => setCollapsed(false)}
      />}
    </div>
  );
};

export default ManageUsers;
