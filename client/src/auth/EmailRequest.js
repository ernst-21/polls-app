import React, {useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, Form, Input, message } from 'antd';
import { emailToPass } from '../user/api-user';
import { useHttpError } from '../hooks/http-hook';

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

const EmailRequest = () => {
  const [redirect, setRedirect] = useState(false);
  const [redirectToNetError, setRedirectToNetError] = useState(false);
  const {httpError, showErrorModal, error} = useHttpError();

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
      email: values.email || undefined,

    };
    emailToPass(user).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else if (data) {
        success(data.message);
        setRedirect(true);
      } else if (!data) {
        setRedirectToNetError(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to='/info'/>;
  }

  if (redirectToNetError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Card
        title="Please enter your e-mail to update your password."
        extra={<Link to="/signin">Cancel</Link>}
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

export default EmailRequest;
