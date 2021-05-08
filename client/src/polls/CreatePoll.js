import React, { useEffect } from 'react';
import { useHttpError } from '../hooks/http-hook';
import { Button, Card, Form, Input, message } from 'antd';
import { create } from './api-polls';
import { Link } from 'react-router-dom';

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

const CreatePoll = () => {
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

      }
    });
  };

  return (
    <Card
      title="Create a Poll"
      extra={<Link to="/polls">Back to Polls List</Link>}
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
          label="Question"
          name="question"
          rules={[
            {
              required: true,
              message: 'Please input a question to create a poll!'
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

export default CreatePoll;
