import React, {useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, Form, Input, Grid } from 'antd';
import { emailToPass } from '../../user/api-user';
import { useHttpError } from '../../hooks/http-hook';
import {useMutation} from 'react-query';
import {success} from '../../components/Message';

const {useBreakpoint} = Grid;

const EmailRequest = () => {
  const [redirect, setRedirect] = useState(false);
  const {httpError, showErrorModal, error} = useHttpError();
  const screens = useBreakpoint();

  const {mutate: emailToPassMutation, isError} = useMutation((user) => emailToPass(user).then(res => res.json()).then(data => data), {
    onSuccess: data => {
      if (data && !data.error) {
        success(data.message);
        setRedirect(true);
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
    };
    emailToPassMutation(user);
  };

  if (redirect) {
    return <Redirect to='/info'/>;
  }

  if (isError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div className="form-card-container">
      <Card
        title={screens.xs === true ? 'Enter e-mail to update password' : 'Please enter your e-mail to update your password.'}
        extra={<Link to="/signin">Cancel</Link>}
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
            name="email"
            label="E-mail:"
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

export default EmailRequest;
