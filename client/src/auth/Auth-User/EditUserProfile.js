import React, { useEffect, useState, useRef } from 'react';
import auth from './auth-helper';
import useUploadImage from '../../hooks/useUploadImage';
import { useHttpError } from '../../hooks/http-hook';
import { Redirect } from 'react-router-dom';
import { Avatar, Button, Card, Form, Input, Select } from 'antd';
import { read, updateUser } from '../../user/api-user';
import { DeleteOutlined } from '@ant-design/icons';
import AvatarUpload from '../../user/AvatarUpload';
import { strongPass, wrongPasswordMessage } from '../../config/config';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { success } from '../../components/Message';
import SpinLoader from '../../components/SpinLoader';

const { Option } = Select;

const EditUserProfile = (props) => {
  const jwt = auth.isAuthenticated();
  const { imageUrl, setImageUrl, uploadPic, deleteImageUrl } = useUploadImage();
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();
  const nodeRef = useRef();
  const [form] = Form.useForm();

  const { closeSideBar } = props;

  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery(
    ['user', props.userId],
    () =>
      read({ userId: props.userId }, { t: jwt.token })
        .then((res) => res.json())
        .then((data) => data),
    {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      onError: () => setRedirectToSignin(true)
    }
  );

  const { mutate: updateUserMutation, status } = useMutation(
    (user) =>
      updateUser({ userId: props.userId }, { t: jwt.token }, user)
        .then((res) => res.json())
        .then((data) => data),
    {
      onSuccess: (data) => {
        form.resetFields();
        queryClient.setQueryData(['user', data._id], data);
        queryClient.invalidateQueries('users');
        success('Account successfully updated.');
      },
      onError: (data) => console.log(data)
    }
  );

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  if (auth.isAuthenticated() && redirectToSignin) {
    return <Redirect to="/" />;
  } else if (!auth.isAuthenticated()) {
    return <Redirect to="/signin" />;
  }

  const handleImageChange = (info) => {
    setImageUrl(info.file.originFileObj);
  };

  const handleImgDelete = () => {
    setImageUrl('');
    deleteImageUrl();
  };

  const clickSubmit = (values) => {
    const usr = {
      name: values.name || undefined,
      email: values.email || undefined,
      role: values.role || undefined,
      pic: imageUrl || user.pic || undefined,
      password: values.confirm || undefined
    };
    updateUserMutation(usr);
    closeSideBar(true);
  };

  if (isError || status === 'error') {
    return <Redirect to="/info-network-error" />;
  }

  return (
    <div className="form-card-container">
      {isLoading ? (
        <SpinLoader />
      ) : (
        <Card
          title="Edit Profile"
          extra={
            <a onClick={props.closeSideBar} ref={nodeRef}>
              Cancel
            </a>
          }
          className="drawer-card"
        >
          <div>
            <p
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '12px'
              }}
            >
              * Empty values will not overwrite actual credentials.
            </p>
            <div className="upload-avatar__container">
              {user && user.pic ? (
                <div className="photo-icon-container">
                  <Avatar size={110} src={user.pic} alt="avatar" />{' '}
                  {user.pic && (
                    <DeleteOutlined
                      style={{ marginTop: '.4rem' }}
                      onClick={() =>
                        queryClient.setQueryData(['user', user._id], {
                          ...user,
                          pic: ''
                        })
                      }
                    />
                  )}
                </div>
              ) : (
                <AvatarUpload
                  onChange={handleImageChange}
                  customRequest={() => uploadPic(imageUrl)}
                  handleDelete={handleImgDelete}
                  url={imageUrl}
                  src={imageUrl}
                  img={imageUrl}
                />
              )}
            </div>

            {user && (
              <Form
                form={form}
                name="basic"
                initialValues={{
                  remember: true,
                  name: user.name,
                  email: user.email,
                  role: user.role
                }}
                onFinish={clickSubmit}
              >
                <Form.Item
                  labelCol={{ span: 24 }}
                  initialValue={user ? user.name : null}
                  label="Username:"
                  name="name"
                  rules={[
                    {
                      required: false,
                      message: 'Please input your username!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 24 }}
                  initialValue={user ? user.email : null}
                  name="email"
                  label="E-mail:"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!'
                    },
                    {
                      required: false
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item labelCol={{ span: 24 }} name="role" label="Role:">
                  <Select>
                    <Option value="admin">Admin</Option>
                    <Option value="user">User</Option>
                    <Option value="power-user">Power-User</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="New Password:"
                  name="password"
                  hasFeedback
                  rules={[
                    {
                      required: false
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || strongPass.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(wrongPasswordMessage));
                      }
                    })
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 24 }}
                  name="confirm"
                  label="Confirm New Password:"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: false
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue('password') === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error('Passwords do not match!')
                        );
                      }
                    })
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{ marginTop: '.5rem' }}
                    type="primary"
                    htmlType="submit"
                  >
                    Update
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EditUserProfile;
