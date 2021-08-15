import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Modal, Card, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Poll from '../../polls/Poll';
import auth from '../Auth-User/auth-helper';
import { Link } from 'react-router-dom';
import { create } from '../../polls/api-polls';
import { useMutation, useQueryClient } from 'react-query';
import { success } from '../../components/Message';
import {validate} from '../../utils/pollValidation-wrangler';

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 15
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
  const [validateReady, setValidateReady] = useState(false);
  const [validateOptions, setValidateOptions] = useState(false);
  const [submitReady, setSubmitReady] = useState(false);
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const { mutate: createMutation, isError } = useMutation((poll) => create(poll, { t: jwt.token }), {
    onSuccess: () => {
      queryClient.invalidateQueries('polls');
      success('Poll successfully created');
      form.resetFields();
      setValidateReady(false);
      setValidateOptions(false);
    }
  });


  const info = () => {
    Modal.info({
      title: 'Poll Preview',
      content: (
        <Poll style={{ marginTop: '1rem' }} question={poll.question} answers={poll.options} />
      ),
      onOk() {
        setSubmitReady(true);
      }
    });
  };

  const onReset = () => {
    form.resetFields();
    setPoll(undefined);
    setValidateOptions(false);
    setValidateReady(false);
  };

  const clickSubmit = () => {
    const finalPoll = {
      question: poll.question,
      answers: poll.options
    };
    createMutation(finalPoll);
  };

  if (isError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        title="Create Poll"
        extra={<Link to="/manage-polls">Back to Manage Polls</Link>}
        style={{ width: '70%', marginTop: '1rem' }}
      >
        <Form {...layout} form={form} name="dynamic_form_nest_item" onFinish={clickSubmit}>
          <Form.Item name="question" label="Question"
            rules={[{ required: true, message: 'Missing question' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Option #1"
            name='first'
            fieldKey='first'
            rules={[{ required: true, message: 'Option #1 is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Option #2"
            name='second'
            fieldKey='second'
            dependencies={['question', 'first']}
            rules={[{ required: true, message: 'Option #2 is required' },
              ({ getFieldValue }) => ({
                async validator(_, value) {
                  if (!value || getFieldValue('first') === value) {
                    await setValidateReady(false);
                    await setValidateOptions(false);
                  }
                  if (!value || !getFieldValue('question') || !getFieldValue('first')) {
                    await setValidateReady(false);
                    await setValidateOptions(false);
                  }
                  if (value && getFieldValue('question').trim().length > 0 && getFieldValue('first').trim().length > 0) {
                    await setValidateReady(true);
                  } else {
                    await setValidateReady(false);
                    await setValidateOptions(false);
                  }
                }
              })
            ]}
          >
            <Input />
          </Form.Item>
          {validateReady && <Form.List
            name="answers"
          >
            {(fields, { add, remove }) => (
              <React.Fragment>
                {fields.map(field => (
                  <div key={field.key} style={{ display: 'flex'}}>
                    <div style={{width: '100%'}}>
                      <Form.Item
                        label='Options'
                        {...field}
                        name={[field.name, 'option']}
                        fieldKey={[field.fieldKey, 'option']}
                        rules={[{
                          required: true,
                          message: 'Type an option or close this field to validate the poll'
                        }]}
                      >
                        <Input style={{marginLeft: '.5rem'}} />
                      </Form.Item>
                    </div>
                    <div style={{ marginTop: '.5rem', marginRight: '.8rem'}}>
                      <MinusCircleOutlined onClick={() => {
                        remove(field.name);
                        setValidateReady(true);
                      }}  />
                    </div>
                  </div>
                ))}
                <Form.Item {...tailLayout}>
                  <div style={{ width: '60%'}}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add options
                    </Button>
                  </div>
                </Form.Item>
              </React.Fragment>
            )}
          </Form.List>}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {validateReady && <Form.Item>
              <Tooltip placement="topLeft"
                title="Duplicated options will not be submitted. Please always validate and preview before submitting">
                <Button
                  type='link'
                  onClick={() => validate(form, setPoll, setValidateOptions)}
                >
                  Validate
                </Button>
              </Tooltip>
            </Form.Item>}
            {validateOptions && <Tooltip placement="topRight" title="Poll will be submitted as shown in preview.">
              <Button
                type='link'
                onClick={info}
              >
                Preview
              </Button>
            </Tooltip>}
          </div>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
              <Button type="primary" htmlType='submit' disabled={!poll || !validateOptions || !submitReady}>
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

