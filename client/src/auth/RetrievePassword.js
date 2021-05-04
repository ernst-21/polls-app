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

const RetrievePassword = () => {

  return (
    <Card
      title="Reset Password"
      extra={<Link to='/signin'>Cancel</Link>}
      className="card"
    >
      <Form
        {...layout}
        name="basic"
        onFinish={() => console.log('Password changed')}
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

export default RetrievePassword;
