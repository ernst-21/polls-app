import React, { useEffect, useState, useRef } from 'react';
import auth from './auth-helper';
import useUploadImage from '../hooks/useUploadImage';
import { useHttpError } from '../hooks/http-hook';
import { Avatar, Button, Card, Form, Input, message } from 'antd';
import { read, updateUser } from '../user/api-user';
import { DeleteOutlined } from '@ant-design/icons';
import AvatarUpload from '../user/AvatarUpload';


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

const EditUserProfile = (props) => {
  const [user, setUser] = useState();
  const jwt = auth.isAuthenticated();
  const { imageUrl, uploadPic, deleteImageUrl } = useUploadImage();
  const [image, setImage] = useState('');
  const { error, showErrorModal, httpError } = useHttpError();
  const userId = props.userId;
  const nodeRef = useRef();
  const [form] = Form.useForm();

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
        setUser({ ...data, password: '', redirectToManageUsers: false });
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
      role: values.role || undefined,
      pic: imageUrl || user.pic || undefined,
      password: values.confirm || undefined
    };
    updateUser(
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
        setUser({ ...user, userId: data._id, redirectToManageUsers: true });
        form.resetFields();
        location.reload();
        info('User successfully updated');
      }
    });
  };


  return (
    <div>
      <Card
        title='Edit Profile'
        extra={<a onClick={props.closeSideBar} ref={nodeRef}>Cancel</a>}
      >
        <div>
          <p style={{ display: 'flex', justifyContent: 'center', fontSize: '12px' }}>* Empty values will not overwrite
            actual credentials.</p>
          {user && user.pic ? (
            <div>
              <Avatar size={110} src={user.pic} alt='avatar' />
              {user.pic && (
                <DeleteOutlined style={{ marginTop: '.4rem' }} onClick={() => setUser({ ...user, pic: '' })} />
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
            form={form}
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
              initialValue={user ? user.role : null}
              label="Role"
              name="role"
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
            <Form.Item {...tailLayout}>
              <Button style={{marginTop: '.5rem'}} type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default EditUserProfile;