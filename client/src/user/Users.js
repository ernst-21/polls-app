import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { list } from './api-user';
import { List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={users}
      renderItem={item => (
        <Link to={'/user/' + item._id}>
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar><UserOutlined /></Avatar> }
              title={item.name}
            />
          </List.Item>
        </Link>
      )}
    />
  );
};

export default Users;
