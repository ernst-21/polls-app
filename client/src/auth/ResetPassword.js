import React, {useState, useEffect} from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, message } from 'antd';
import { useHttpError } from '../hooks/http-hook';
import { resetPass } from '../user/api-user';

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

const ResetPassword = () => {
  const [redirect, setRedirect] = useState(false);
  const {httpError, showErrorModal, error} = useHttpError();
  const token = useParams().token;

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
      password: values.password || undefined,
    };
    resetPass({token: token}, user).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        success('Password Reset Successful. Please sign in.');
        setRedirect(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to='/signin'/>;
  }

  return (
    <Card
      title="Reset Password"
      extra={<Link to='/signin'>Cancel</Link>}

    >
      <Form
        {...layout}
        name="basic"
        onFinish={clickSubmit}
        className="form-container"
      >
        <Form.Item
          label="Enter new password"
          name="password"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input your new password!'
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
          label="Confirm new password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your new password!'
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
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ResetPassword;
