import React, { useEffect } from 'react';
import { useHttpError } from '../hooks/http-hook';
import { Button, Card, Form, Input, message } from 'antd';
import { create } from '../polls/api-polls';
import auth from './auth-helper';

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
  const jwt = auth.isAuthenticated();
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
    const poll = {
      question: values.question
    };
    create(poll, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        showErrorModal(data.error);
      } else {
        location.reload();
        console.log(data);
        success('Poll successfully created');

      }
    });
  };

  return (
    <Card
      title="Create a Poll"
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
