import React, { useEffect, useState, memo } from 'react';
import auth from '../auth/Auth-User/auth-helper';
import { removeUser, removeProfile } from './api-user.js';
import { Redirect } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useHttpError } from '../hooks/http-hook';
import { useMutation, useQueryClient } from 'react-query';
import {success} from '../components/Message';

import './DeleteButton.css';

const DeleteUser = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectToTable, setRedirectToTable] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();
  const jwt = auth.isAuthenticated();

  const { closeSideBar } = props;

  const queryClient = useQueryClient();

  const { mutate: removeProfileMutation, status } = useMutation(
    () =>
      removeProfile(
        {
          userId: props.userId
        },
        { t: jwt.token }
      ).then(res => res.json()).then((data) => data),
    {
      onSuccess: (data) => {
        if (data && !data.error) {
          queryClient.invalidateQueries('users');
          auth.clearJWT(() => success('Account successfully deleted'));
          setRedirect(true);
        } else {
          showErrorModal(data.error);
        }
      }
    }
  );
  const { mutate: removeUserMutation, isError } = useMutation(
    () =>
      removeUser(
        {
          userId: props.userId
        },
        { t: jwt.token }
      ).then(res => res.json()).then((data) => data),
    {
      onSuccess: (data) => {
        if (data) {
          success('User successfully deleted');
          queryClient.invalidateQueries('users');
          closeSideBar(true);
          setRedirectToTable(true);
        } else {
          showErrorModal(data.error);
        }
      }
    }
  );

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const deleteAccount = () => {
    auth.isAuthenticated().user.role !== 'admin'
      ? removeProfileMutation()
      : removeUserMutation();
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
    return <Redirect to="/" />;
  }

  if (redirectToTable) {
    return <Redirect to="/manage-users" />;
  }

  if (isError || status === 'error') {
    return <Redirect to="/info-network-error" />;
  }

  return (
    <div className="delete-btn-container">
      <Button onClick={showModal} className="delete-btn">
        DELETE ACCOUNT
        <DeleteOutlined />
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          By clicking OK your account will be deleted. This action cannot be
          undone
        </p>
      </Modal>
    </div>
  );
};

export default memo(DeleteUser);
