import React, { useEffect, useState } from 'react';
import auth from '../auth/Auth-User/auth-helper';
import { removeUser } from './api-user.js';
import { Redirect } from 'react-router-dom';
import { Modal, Card, message, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useHttpError } from '../hooks/http-hook';

export default function DeleteUser(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectToNetError, setRedirectToNetError] = useState(false);
  const [redirectToTable, setRedirectToTable] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const success = (msg) => {
    message.success(msg);
  };

  const deleteAccount = () => {
    auth.isAuthenticated().user.role !== 'admin' ?
      removeUser({
        userId: props.userId
      }, { t: jwt.token }).then((data) => {
        if (data && data.error) {
          showErrorModal(data.error);
        } else if (data) {
          auth.clearJWT(() => success('Account successfully deleted'));
          setRedirect(true);
        } else if (!data) {
          setRedirectToNetError(true);
        }
      }) : removeUser({
        userId: props.userId
      }, { t: jwt.token }).then((data) => {
        if (data && data.error) {
          showErrorModal(data.error);
        } else if (data) {
          success('User successfully deleted');
          setRedirectToTable(true);
          location.reload();
        } else if (!data) {
          setRedirectToNetError(true);
        }
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    deleteAccount();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (redirect) {
    return <Redirect to='/' />;
  }

  if (redirectToTable) {
    return <Redirect to='/manage-users' />;
  }

  if (redirectToNetError) {
    return <Redirect to='/info-network-error'/>;
  }

  return (
    <>
      <Card>
        <Button onClick={showModal} style={{ color: 'red' }}>DELETE ACCOUNT<DeleteOutlined /></Button>

      </Card>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>By clicking OK your account will be deleted. This action cannot be undone</p>
      </Modal>
    </>
  );

}

