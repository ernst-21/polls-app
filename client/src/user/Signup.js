import React, { useState, useEffect, memo } from 'react';
import { createUser } from './api-user.js';
import { Link, Redirect } from 'react-router-dom';
import { useHttpError } from '../hooks/http-hook';
import { Form, Input, Button, Card, Grid } from 'antd';
import { strongPass, wrongPasswordMessage } from '../config/config';
import { useMutation } from 'react-query';
import { success } from '../components/Message';

const { useBreakpoint } = Grid;

const Signup = (props) => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();
  const screens = useBreakpoint();

  const { mutate: signUpMutation, isError } = useMutation(
    (user) =>
      createUser(user)
        .then((res) => res.json())
        .then((data) => data),
    {
      onSuccess: (data) => {
        if (data && !data.error) {
          setRedirectToReferrer(true);
          success(data.message);
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

  const clickSubmit = (values) => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.confirm || undefined
    };
    signUpMutation(user);
  };

  const { from } = props.location.state || {
    from: {
      pathname: '/signin'
    }
  };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  if (isError) {
    return <Redirect to="/info-network-error" />;
  }

  return (
    <div className="form-card-container">
      <Card
        className={screens.xs === true ? 'drawer-card' : 'form-card'}
        title="Register"
        extra={<Link to="/signin">Already registered? Login instead</Link>}
      >
        <Form
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={clickSubmit}
        >
          <Form.Item
            labelCol={{ span: 24 }}
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
            labelCol={{ span: 24 }}
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
            labelCol={{ span: 24 }}
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
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                }
              })
            ]}
          >
            <Input.Password />
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

export default memo(Signup);
