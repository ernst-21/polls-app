import React, { useState, useEffect } from 'react';
import auth from './auth-helper';
import { Link, Redirect } from 'react-router-dom';
import { signin } from './api-auth.js';
import { useHttpError } from '../../hooks/http-hook';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import {useMutation} from 'react-query';

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

  const {mutate: signInMutation, isError} = useMutation((user) => signin(user).then(data => data), {
    onSuccess: (data) => {
      if (data && !data.error) {
        auth.authenticate(data, () => {
          setRedirectToReferrer(true);
        });
      } else {
        showErrorModal(data.error);
      }
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
      email: values.email || undefined,
      password: values.password || undefined
    };
    signInMutation(user);
  };

  const { from } = props.location.state || {
    from: {
      pathname: '/polls'
    }
  };

  if (redirectToReferrer) {
    return (<Redirect to={from} />);
  }

  if (isError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Card
        title="Login"
        extra={
          <Link to="/signup">Don&apos;t have an account? Sign Up instead</Link>
        }
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
          <Link to='/email' style={{ display: 'flex', float: 'right' }}>Forgot password?</Link>
        </Form>
      </Card>
    </div>
  );
};

export default Signin;
