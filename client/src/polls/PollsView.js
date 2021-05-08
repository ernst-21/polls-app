import React, { useState, useEffect } from 'react';
import { list } from './api-polls';
import { Col, List, Row, Typography } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import Poll from './Poll';
import SideBar from '../core/SideBar';

const { Title } = Typography;

const isActive = (active) => {
  if (active === true)
    return { color: '#28079d', fontSize: '26px', marginLeft: '1rem' };
  else
    return { color: '#1890FF', fontSize: '26px', marginLeft: '1rem' };
};

const PollsView = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [component, setComponent] = useState(null);
  const [polls, setPolls] = useState([]);
  const [barsActive, setBarsActive] = useState(true);
  const [value, setValue] = React.useState('');

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
    console.log(value);
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

  const showAside = (item, id) => {
    setCollapsed(true);
    setComponent(<Poll
      question={item.question}
      yesPct={(item.answerYes / item.voters) * 100}
      noPct={(item.answerNo / item.voters) * 100}
      value={value}
      onChange={onChange}
      onClick={() => console.log(id, value)} />);
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
                    yesPct={(item.answerYes / item.voters) * 100}
                    noPct={(item.answerNo / item.voters) * 100}
                    value={value}
                    onChange={onChange} onClick={() => console.log(item._id, value)} /></Col>;
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
