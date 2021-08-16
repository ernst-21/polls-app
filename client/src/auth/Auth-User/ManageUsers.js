import React, { useState } from 'react';
import { Button, Modal, Card } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Profile from '../../user/Profile';
import { Redirect } from 'react-router-dom';
import EditUserProfile from './EditUserProfile';
import auth from './auth-helper';
import { listUsers, removeUser } from '../../user/api-user';
import { Link } from 'react-router-dom';
import SideDrawer from '../../core/SideDrawer';
import AboveListBar from '../../core/AboveListBar';
import UsersTable from './UsersTable';
import { success } from '../../components/Message';
import UsersStats from './UserStats';

const ManageUsers = () => {
  const jwt = auth.isAuthenticated();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [component, setComponent] = useState(null);
  const [sourceData, setSourceData] = useState([]);

  const { data: users = [], isLoading, isError } = useQuery('users', () => listUsers().then(res => res.json()).then(data => data));

  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation((id) => removeUser({ userId: id }, { t: jwt.token }), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      success('User successfully deleted');
    }
  });

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

  if (isError) {
    return <Redirect to='/info-network-error' />;
  }

  const closeDrawer = () => {
    setCollapsed(false);
  };

  return (
    <div className='users'>
      <AboveListBar>
        <Link to='/create-user'>
          <Button style={{ marginBottom: '1rem' }} type='primary'>CREATE</Button>
        </Link>
        <UsersStats users={users} />
      </AboveListBar>
      <UsersTable isLoading={isLoading} setSourceData={setSourceData} users={users} showModal={showModal}
        viewProfile={viewProfile} sourceData={sourceData} />
      <Modal title="Delete User" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>By clicking OK your account will be deleted. This action cannot be undone</p>
      </Modal>
      <SideDrawer
        title='User Details'
        width={650}
        placement='right'
        isSideDrawerOpen={collapsed}
        onDrawerClose={closeDrawer}
        component={component}
      />
    </div>
  );
};

export default ManageUsers;
