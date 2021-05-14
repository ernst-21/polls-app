import React, { useEffect, useState } from 'react';
import { useHttpError } from '../hooks/http-hook';
import { Button, Card, Form, Input, message, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { create } from '../polls/api-polls';
import auth from './auth-helper';
import { Link } from 'react-router-dom';
import Poll from '../polls/Poll';

const layout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 10
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 8
  }
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 7 }
  }
};

const CreatePoll = () => {
  const jwt = auth.isAuthenticated();
  const [question, setQuestion] = useState('');
  const [option, setOption] = useState();
  const { error, showErrorModal, httpError } = useHttpError();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const success = (msg) => {
    message.success(msg);
  };

  const handleQuestion = (values) => {
    setQuestion(values.question);
  };

  const handleOptions = (values) => {
    setOption(values.options);
  };

  const clickSubmit = () => {
    const poll = {
      question: question,
      answers: option
    };
    create(poll, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        showErrorModal(data.error);
      } else {
        success('Poll successfully created');
        form.resetFields();
        setQuestion('');
        setOption(null);
      }
    });
  };

  return (
    <>
      <Card
        title="Create a Poll"
        extra={
          <Link to="/manage-polls">Manage Polls</Link>
        }
        style={{ marginTop: '1rem' }}
      >
        <div>
          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: false
            }}
            onFinish={handleQuestion}

          >
            <Form.Item
              label="Question"
              name="question"
              rules={[
                {
                  required: false

                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              {question ? (<Button type="secondary" htmlType='submit'>
                Reset Question
              </Button>) : (<Button type="secondary" htmlType='submit'>
                Save Question
              </Button>)}
            </Form.Item>
          </Form>
          <Form form={form} name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={handleOptions}>
            <Form.List
              name="options"
              rules={[
                {
                  validator: async (_, options) => {
                    if (!options || options.length < 2) {
                      return Promise.reject(new Error('At least 2 options'));
                    }
                  }
                }
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Options' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input an option or delete this field.'
                          }
                        ]}
                        noStyle
                      >
                        <Input placeholder="option" style={{ width: '60%' }} />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => {
                            remove(field.name);
                            console.log(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '60%' }}
                      icon={<PlusOutlined />}
                    >
                      Add Option
                    </Button>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add('The head item', 0);
                      }}
                      style={{ width: '60%', marginTop: '20px' }}
                      icon={<PlusOutlined />}
                    >
                      Add Option at head
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="secondary" htmlType="submit">
                Save Options
              </Button>
            </Form.Item>
          </Form>
          <div style={{ display: 'flex', placeItems: 'center', flexDirection: 'column' }}>
            <Button disabled={!question || !option}
              type='link'
              onClick={showModal}
            >
              Preview
            </Button>
            <Button
              disabled={!question || !option}
              style={{ marginTop: '2rem', width: '40%' }}
              htmlType='submit' type='primary' onClick={clickSubmit}
            >
              Submit Poll
            </Button>
          </div>
        </div>
      </Card>

      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Poll question={question} answers={option} />
      </Modal>
    </>
  );
};

export default CreatePoll;
