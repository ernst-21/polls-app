import React, { useEffect} from 'react';
import { useHttpError } from '../../hooks/http-hook';
import { Button, Card, Checkbox, Form, Input, Select, Grid } from 'antd';
import { createUser } from '../../user/api-user';
import { Link, Redirect } from 'react-router-dom';
import {strongPass, wrongPasswordMessage} from '../../config/config';
import { useMutation, useQueryClient } from 'react-query';
import { success } from '../../components/Message';

const {useBreakpoint} = Grid;

const {Option} = Select;

const CreateUser = (props) => {
  const { error, showErrorModal, httpError } = useHttpError();
  const screens = useBreakpoint();

  const queryClient = useQueryClient();

  const { mutate: createMutation, isError, isSuccess } = useMutation((user) => createUser(user), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      success('User successfully created');
    }
  });


  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);


  const clickSubmit = (values) => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      role: values.role || undefined,
      password: values.confirm || undefined
    };
    createMutation(user);
  };

  const { from } = props.location.state || {
    from: {
      pathname: '/manage-users'
    }
  };

  if (isSuccess) {
    return <Redirect to={from} />;
  }

  if (isError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div className='form-card-container'>
      <Card
        title="Create User"
        extra={<Link to="/manage-users">Cancel</Link>}
        className={screens.xs === true ? 'drawer-card' : 'form-card'}
      >
        <Form
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={clickSubmit}
        >
          <Form.Item
            labelCol={{span: 24}}
            label="Username"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your username!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{span: 24}}
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{span: 24}}
            name="role"
            label="Role">
            <Select style={{ width: 120 }}>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="power-user">Power-User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            labelCol={{span: 24}}
            label="Password"
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input your password!'
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
            labelCol={{span: 24}}
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords that you entered do not match!')
                  );
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;
