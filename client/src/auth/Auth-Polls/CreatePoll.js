import React, { useState, memo } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Modal, Card, Tooltip, Grid } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Poll from '../../polls/Poll';
import auth from '../Auth-User/auth-helper';
import { Link } from 'react-router-dom';
import { create } from '../../polls/api-polls';
import { useMutation, useQueryClient } from 'react-query';
import { success } from '../../components/Message';
import {validate} from '../../utils/pollValidation-wrangler';

import './CreatePoll.css';

const {useBreakpoint} = Grid;

const CreatePoll = () => {
  const jwt = auth.isAuthenticated();
  const [poll, setPoll] = useState();
  const [validateReady, setValidateReady] = useState(false);
  const [validateOptions, setValidateOptions] = useState(false);
  const [submitReady, setSubmitReady] = useState(false);
  const [form] = Form.useForm();

  const screens = useBreakpoint();

  const queryClient = useQueryClient();

  const { mutate: createMutation, isError } = useMutation((poll) => create(poll, { t: jwt.token }).then(res => res.json()).then(data => data), {
    onSuccess: (data) => {
      if (data && !data.error) {
        queryClient.invalidateQueries('polls');
        success('Poll successfully created');
        form.resetFields();
        setValidateReady(false);
        setValidateOptions(false);
      }
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
    <div className='form-card-container'>
      <Card
        title="Create Poll"
        extra={<Link to="/manage-polls">Back to Manage Polls</Link>}
        className={screens.xs === true ? 'drawer-card' : 'form-card'}
      >
        <Form form={form} name="dynamic_form_nest_item" onFinish={clickSubmit}>
          <Form.Item
            labelCol={{span: 24}}
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Missing question' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{span: 24}}
            label="Option #1"
            name='first'
            fieldKey='first'
            rules={[{ required: true, message: 'Option #1 is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{span: 24}}
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
                  <div key={field.key} className='option-container'>
                    <div className='option-input-container'>
                      <Form.Item
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        label='More Options'
                        {...field}
                        name={[field.name, 'option']}
                        fieldKey={[field.fieldKey, 'option']}
                        rules={[{
                          required: true,
                          message: 'Type an option or close this field to validate the poll'
                        }]}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                    <div className='minus-circle'>
                      <MinusCircleOutlined onClick={() => {
                        remove(field.name);
                        setValidateReady(true);
                      }}  />
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <div>
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
            <div className='create-poll_button-container'>
              <Button className='create-poll_reset-btn' htmlType="button" onClick={onReset}>
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

export default memo(CreatePoll);

