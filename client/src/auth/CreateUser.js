import React, { useEffect, useState } from 'react';
import { useHttpError } from '../hooks/http-hook';
import { Button, Card, Checkbox, Form, Input, message, Select } from 'antd';
import { create } from '../user/api-user';
import { Link, Redirect } from 'react-router-dom';
import {strongPass, wrongPasswordMessage} from '../config/config';

const {Option} = Select;

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
    offset: 8,
    span: 16
  }
};

const CreateUser = (props) => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [redirectToNetError, setRedirectToNetError] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const success = (msg) => {
    message.success(msg);
  };

  const clickSubmit = (values) => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      role: values.role || undefined,
      password: values.confirm || undefined
    };
    create(user).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else if (data) {
        success('User successfully created');
        setRedirectToReferrer(true);
      } else if (!data) {
        setRedirectToNetError(true);
      }
    });
  };

  const { from } = props.location.state || {
    from: {
      pathname: '/manage-users'
    }
  };

  if (redirectToReferrer) {
    return (<Redirect to={from} />);
  }

  if (redirectToNetError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Card
        title="Create User"
        extra={<Link to="/manage-users">Cancel</Link>}
        style={{ width: '50%', marginTop: '1rem' }}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={clickSubmit}
        >
          <Form.Item
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
            name="role"
            label="Role">
            <Select style={{ width: 120 }}>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="power-user">Power-User</Option>
            </Select>
          </Form.Item>
          <Form.Item
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
          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout}>
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
