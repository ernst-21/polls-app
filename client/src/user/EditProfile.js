import React, { useState, useEffect } from 'react';
import auth from './../auth/auth-helper';
import { read, update } from './api-user.js';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Avatar, Button, Card, Checkbox, Form, Input, message } from 'antd';
import { useHttpError } from '../hooks/http-hook';
import AvatarUpload from './AvatarUpload';
import useUploadImage from '../hooks/useUploadImage';
import { DeleteOutlined } from '@ant-design/icons';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16
  }
};

const EditProfile = () => {
  const [user, setUser] = useState();
  const jwt = auth.isAuthenticated();
  const { imageUrl, uploadPic, deleteImageUrl } = useUploadImage();
  const [image, setImage] = useState('');
  const { error, showErrorModal, httpError } = useHttpError();
  const userId = useParams().userId;

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const errorMessage = (err) => {
    message.error(err);
  };

  const info = (msg) => {
    message.info(msg);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: userId
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        errorMessage(data.error);
      } else {
        setUser({ ...data, password: '', redirectToProfile: false });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [userId, jwt.token]);

  const handleImageChange = (info) => {
    setImage(info.file.originFileObj);
  };

  const handleImgDelete = () => {
    setImage('');
    deleteImageUrl();
  };

  const clickSubmit = (values) => {
    const usr = {
      name: values.name || undefined,
      email: values.email || undefined,
      pic: imageUrl || undefined,
      password: values.confirm || undefined
    };
    update(
      {
        userId: userId
      },
      {
        t: jwt.token
      },
      usr
    ).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        setUser({ ...user, userId: data._id, redirectToProfile: true });
        info('Account successfully updated');
      }
    });
  };

  if (user && user.redirectToProfile) {
    return <Redirect to={'/user/' + user.userId} />;
  }

  return (
    <Card
      title="Edit Profile"
      extra={<Link to={`/user/${userId}`}>Cancel</Link>}
      className="card"
    >
      <div>
        {user && user.pic ? (
          <div className="upload-avatar__container">
            <Avatar size={110} src={user.pic} />
            {user.pic && (
              <DeleteOutlined style={{marginTop: '.4rem'}} onClick={() => setUser({ ...user, pic: '' })} />
            )}
          </div>
        ) : (
          <AvatarUpload
            onChange={handleImageChange}
            customRequest={() => uploadPic(image)}
            handleDelete={handleImgDelete}
            url={imageUrl}
            src={imageUrl}
            img={image}
          />
        )}

        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={clickSubmit}
        >
          <Form.Item
            initialValue={user ? user.name : null}
            label="Username"
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
            initialValue={user ? user.email : null}
            name="email"
            label="E-mail"
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
          <Form.Item
            label="New Password"
            name="password"
            hasFeedback
            rules={[
              {
                required: false
              },
              () => ({
                validator(_, value) {
                  if (!value || value.length >= 6) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error('Password must contain at least 6 characters.')
                  );
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm New Password"
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
                    new Error(
                      'Passwords do not match!'
                    )
                  );
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default EditProfile;
