import React, { useState, useEffect } from 'react';
import { list, voteYes, voteNo} from './api-polls';
import { Col, List, Row, Typography, message } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import Poll from './Poll';
import SideBar from '../core/SideBar';
import auth from '../auth/auth-helper';
import { useHttpError } from '../hooks/http-hook';

const { Title } = Typography;

const isActive = (active) => {
  if (active === true)
    return { color: '#28079d', fontSize: '26px', marginLeft: '1rem' };
  else
    return { color: '#1890FF', fontSize: '26px', marginLeft: '1rem' };
};

const PollsView = () => {
  const jwt = auth.isAuthenticated();
  const [collapsed, setCollapsed] = useState(false);
  const [userId, setUserId] = useState('');
  const [component, setComponent] = useState(null);
  const [polls, setPolls] = useState([]);
  const [barsActive, setBarsActive] = useState(true);
  const [value, setValue] = useState();
  const { error, showErrorModal, httpError } = useHttpError();

  useEffect(() => {
    setValue(value);
    if (jwt) {
      setUserId(auth.isAuthenticated().user._id);
    }
  }, [value, jwt]);

  const onChange = (e) => {
    setValue(e.target.value);
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

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setPolls(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const submitYes = (id) => {
    const user = {
      userId: userId
    };
    voteYes(
      {
        pollId: id
      },
      {
        t: jwt.token
      },
      user
    ).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        location.reload();
        success('Poll successfully voted.');
      }
    });
  };

  const submitNo = (id) => {
    const user = {
      userId: userId
    };
    voteNo(
      {
        pollId: id
      },
      {
        t: jwt.token
      },
      user
    ).then((data) => {
      if (data && data.error) {
        showErrorModal(data.error);
      } else {
        location.reload();
        success('Poll successfully voted.');
      }
    });
  };

  const showAside = (item, id) => {
    setCollapsed(true);
    setComponent(<Poll
      question={item.question}
      yesPct={Math.round((item.answerYes.length / item.voters.length) * 100)}
      noPct={Math.round((item.answerNo.length / item.voters.length) * 100)}
      value={value}
      voted={item.voters.includes(userId)}
      onChange={onChange}
      onClick={value === 'yes' ? () => submitYes(id) : () => submitNo(id)} />);
  };

  return (
    <>
      <>
        <div style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>
          <>
            <BarsOutlined
              style={isActive(barsActive)}
              onClick={() => setBarsActive(true)}
            />
          </>
          <>
            <AppstoreOutlined
              style={isActive(barsActive)}
              onClick={() => {
                setBarsActive(false);
                setCollapsed(false);
              }} />
          </>
        </div>
        <div className='polls-container'>
          <div className='polls' >
            {barsActive ? (<List
              itemLayout="horizontal"
              style={{ marginTop: '2rem' }}
              dataSource={polls}
              renderItem={item => (
                <List.Item>
                  <Title level={4} onClick={() => showAside(item, item._id)}>{item.question}</Title>
                </List.Item>
              )}
            />)
              :
              (<Row gutter={[24, 32]}>
                {polls.map(item => {
                  return <Col key={item._id} className="gutter-row" span={7}><Poll
                    question={item.question}
                    yesPct={Math.round((item.answerYes.length / item.voters.length) * 100)}
                    noPct={Math.round((item.answerNo.length / item.voters.length) * 100)}
                    value={value}
                    voted={item.voters.includes(userId)}
                    onChange={onChange}
                    onClick={value === 'yes' ? () => submitYes(item._id) : () => submitNo(item._id)} /></Col>;
                })}
              </Row>)}
          </div>
        </div>
      </>
      {collapsed && <SideBar
        isSidebarOpen={collapsed}
        component={component}
        onClick={() => setCollapsed(false)}
      />}
    </>
  );
};

export default PollsView;
