import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Modal, Card, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Poll from '../polls/Poll';
import auth from './auth-helper';
import { Link } from 'react-router-dom';
import { create } from '../polls/api-polls';
import { useHttpError } from '../hooks/http-hook';

const layout = {
  labelCol: {
    span: 6
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
  const [poll, setPoll] = useState();
  const [doneReady, setDoneReady] = useState(false);
  const { error, showErrorModal, httpError } = useHttpError();
  const [validateOptions, setValidateOptions] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (error) {
      httpError();
    }
    return () => showErrorModal(null);
  }, [error, httpError, showErrorModal]);

  const success = (msg) => {
    message.success(msg);
  };

  const filterOutUndefined = (array) => {
    return array.filter(item => item !== undefined);
  };

  const hasDuplicates = (array) => {
    const newArray = array.map(item => {
      return item.trim().toLowerCase();
    });
    const duplicate = (new Set(newArray)).size !== newArray.length;
    if (duplicate) {
      Modal.error({
        title: 'Error',
        content: 'Options must be unique. Please check the given options',
        onOk() {
          setValidateOptions(false);
          setPoll(undefined);
        }
      });
    }
  };

  const done = () => {
    const values = form.getFieldsValue();
    const answers = values.answers ? filterOutUndefined(values.answers) : null;
    const additionalOptions = answers && answers.length > 0 ? answers.map(item => item.option.trim()) : null;
    const filteredAdditionalOptions = additionalOptions ? additionalOptions.filter(item => item !== '') : null;
    let options = [values.first, values.second];
    if (filteredAdditionalOptions) {
      filteredAdditionalOptions.map(item => options.push(item));
    }
    if (options && options.length >= 2) {
      const noDuplicates = !hasDuplicates(options);
      if (noDuplicates) {
        setValidateOptions(true);
        setPoll({ question: values.question, options: options });
      }
    }
  };

  const info = () => {
    console.log(poll);
    Modal.info({
      title: 'Poll Preview',
      content: (
        <Poll style={{ marginTop: '1rem' }} question={poll.question} answers={poll.options} />
      ),
      onOk() {
      }
    });
  };

  const onReset = () => {
    form.resetFields();
    setPoll(undefined);
    setValidateOptions(false);

  };

  const clickSubmit = () => {
    console.log(poll);
    const finalPoll = {
      question: poll.question,
      answers: poll.options
    };
    create(finalPoll, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        showErrorModal(data.error);
      } else {
        success('Poll successfully created');
        form.resetFields();
      }
    });
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        title="Create Poll"
        extra={<Link to="/manage-polls">Back to Manage Polls</Link>}
        style={{ width: '70%', marginTop: '1rem' }}
      >
        <Form {...layout} form={form} name="dynamic_form_nest_item" onFinish={clickSubmit}>
          <Form.Item name="question" label="Question" rules={[{ required: true, message: 'Missing question' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Option #1"
            name='first'
            fieldKey='first'
            rules={[{ required: true, message: 'Missing option' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Option #2"
            name='second'
            fieldKey='second'
            rules={[{ required: true, message: 'Missing option' }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('option1') !== value) {
                  setDoneReady(true);
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Every option in the poll must be unique!')
                );
              }
            })]}
          >
            <Input />
          </Form.Item>
          <Form.List
            name="answers"
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <div key={field.key} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Space align="baseline">
                      <Form.Item
                        label='Options'
                        {...field}
                        name={[field.name, 'option']}
                        fieldKey={[field.fieldKey, 'option']}
                        rules={[{ required: true, unique: true, message: 'Type an option or close this field' }]}
                      >
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  </div>
                ))}
                {!validateOptions && <Form.Item {...tailLayout}>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add options
                  </Button>
                </Form.Item>}
              </>
            )}
          </Form.List>

          <div style={{ display: 'flex' }}>
            {doneReady && <Form.Item>
              <Button
                type='link'
                onClick={() => done()}
              >
                Validate Options
              </Button>

            </Form.Item>}
            {poll && poll.options && validateOptions && <Button
              type='link'
              onClick={info}
            >
              Preview
            </Button>}
            {validateOptions && <Button
              type='link'
              onClick={() => {
                setValidateOptions(false);
                setPoll(undefined);
              }}
            >
              Keep adding options
            </Button>}
          </div>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
              <Button type="primary" htmlType='submit' disabled={!poll || !validateOptions}>
                Submit
              </Button>
            </div>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );

};

export default CreatePoll;

