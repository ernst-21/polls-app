import React, { useEffect, useState } from 'react';
import auth from './../auth/auth-helper';
import { remove, removeUser } from './api-user.js';
import { Redirect } from 'react-router-dom';
import { Modal, Card, message, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useHttpError } from '../hooks/http-hook';

export default function DeleteUser(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);
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
      remove({
        userId: props.userId
      }, { t: jwt.token }).then((data) => {
        if (data && data.error) {
          showErrorModal(data.error);
        } else {
          auth.clearJWT(() => success('Account successfully deleted'));
          setRedirect(true);
        }
      }) : removeUser({
        userId: props.userId
      }, { t: jwt.token }).then((data) => {
        if (data && data.error) {
          showErrorModal(data.error);
        } else {
          success('User successfully deleted');
          setRedirectToTable(true);
          location.reload();
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

