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
      if (data.error) {
        showErrorModal(data.error);
      } else {
        success(data.message);
        setRedirect(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to='/info'/>;
  }

  return (
    <Card
      title="Please enter your e-mail to update your password."
      extra={<Link to="/signin">Cancel</Link>}

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
  );
};

export default EmailRequest;
