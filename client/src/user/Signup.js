import React, { useState, useEffect } from 'react';
import { create } from './api-user.js';
import { Link, Redirect } from 'react-router-dom';
import { useHttpError } from '../hooks/http-hook';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import {strongPass, wrongPasswordMessage} from '../config/config';

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

const Signup = (props) => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
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
      password: values.confirm || undefined
    };
    create(user).then((data) => {
      if (data.error) {
        showErrorModal(data.error);
      } else {
        success(data.message);
        setRedirectToReferrer(true);
      }
    });
  };

  const { from } = props.location.state || {
    from: {
      pathname: '/signin'
    }
  };

  if (redirectToReferrer) {
    return (<Redirect to={from} />);
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Card
        title="Register"
        extra={<Link to="/signin">Already registered? Login instead</Link>}
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
          <Link to='/email' style={{ display: 'flex', float: 'right' }}>Forgot password?</Link>
        </Form>
      </Card>
    </div>
  );
}
;

export default Signup;
