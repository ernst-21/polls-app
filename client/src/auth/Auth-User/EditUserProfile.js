import React, { useEffect, useState, useRef } from 'react';
import auth from './auth-helper';
import useUploadImage from '../../hooks/useUploadImage';
import { useHttpError } from '../../hooks/http-hook';
import { Redirect } from 'react-router-dom';
import { Avatar, Button, Card, Form, Input, Select, Spin } from 'antd';
import { read, updateUser } from '../../user/api-user';
import { DeleteOutlined } from '@ant-design/icons';
import AvatarUpload from '../../user/AvatarUpload';
import {strongPass, wrongPasswordMessage} from '../../config/config';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { success } from '../../components/Message';

const { Option } = Select;

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
  const [setUser] = useState();
  const jwt = auth.isAuthenticated();
  const { imageUrl, uploadPic, deleteImageUrl } = useUploadImage();
  const [image, setImage] = useState('');
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();
  const nodeRef = useRef();
  const [form] = Form.useForm();

  const {closeSideBar} = props;

  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery(['user', props.userId], () => read({ userId: props.userId }, { t: jwt.token }).then(res => res.json()).then(data => data), { onError: () => setRedirectToSignin(true) });



  const { mutate: updateUserMutation } = useMutation((user) => updateUser({ userId: props.userId }, { t: jwt.token }, user).then(data => data), {
    onSuccess: (data) => {
      form.resetFields();
      queryClient.setQueryData(['user', data._id], data);
      queryClient.invalidateQueries('users');
      success('Account successfully updated.');
    },
    onError: (data) => console.log(data)
  });


  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);


  if (auth.isAuthenticated() && redirectToSignin) {
    return <Redirect to='/' />;
  } else if (!auth.isAuthenticated()) {
    return <Redirect to='/signin' />;
  }

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
    updateUserMutation(usr);
    closeSideBar(true);
  };

  if (isError) {
    return <Redirect to='/info-network-error'/>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {isLoading ? (<Spin />) : (<Card
        title='Edit Profile'
        extra={(<a onClick={props.closeSideBar} ref={nodeRef}>Cancel</a>)}
        style={{width: '100%'}}
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

          {user && <Form
            form={form}
            {...layout}
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
              name="role"
              label="Role">
              <Select style={{ width: 120 }}>
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
                <Option value="power-user">Power-User</Option>
              </Select>
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
                    if (!value || strongPass.test(value)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(wrongPasswordMessage)
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
              <Button style={{ marginTop: '.5rem' }} type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>}
        </div>
      </Card>)}
    </div>
  );
};

export default EditUserProfile;
