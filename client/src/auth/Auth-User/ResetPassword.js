import React, {useState, useEffect} from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, message } from 'antd';
import { useHttpError } from '../../hooks/http-hook';
import { resetPass } from '../../user/api-user';
import {strongPass, wrongPasswordMessage} from '../../config/config';

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
  const [redirectToNetError, setRedirectToNetError] = useState(false);
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
      } else if (data) {
        success('Password Reset Successful. Please sign in.');
        setRedirect(true);
      } else if (!data) {
        setRedirectToNetError(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to='/signin'/>;
  }

  if (redirectToNetError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Card
        title="Reset Password"
        extra={<Link to='/signin'>Cancel</Link>}
        style={{ width: '50%', marginTop: '1rem' }}
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
    </div>
  );
};

export default ResetPassword;
