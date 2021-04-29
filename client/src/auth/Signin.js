import React, { useState, useEffect } from 'react';
import auth from './../auth/auth-helper';
import { Link, Redirect } from 'react-router-dom';
import { signin } from './api-auth.js';
import { useHttpError } from '../hooks/http-hook';
import { Form, Input, Button, Checkbox, Card } from 'antd';

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

const Signin = (props) => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const clickSubmit = (values) => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    };
    signin(user).then((data) => {
      if (data.error) {
        showErrorModal(data.error);
      } else {
        auth.authenticate(data, () => {
          setRedirectToReferrer(true);
        });
      }
    });
  };

  const { from } = props.location.state || {
    from: {
      pathname: '/'
    }
  };

  if (redirectToReferrer) {
    return (<Redirect to={from} />);
  }

  return (
    <Card
      title="Login"
      extra={
        <Link to="/signup">Don&apos;t have an account? Sign Up instead</Link>
      }
      className="card"
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true
        }}
        onFinish={clickSubmit}
        className="form-container"
      >
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
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!'
            }
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
  );
};

export default Signin;
