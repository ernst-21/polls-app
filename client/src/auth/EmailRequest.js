import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form, Input } from 'antd';

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
  return (
    <Card
      title="Please enter your e-mail to update your password."
      extra={<Link to="/signin">Cancel</Link>}
      className="card"
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true
        }}
        onFinish={() => console.log('Email sent')}
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
