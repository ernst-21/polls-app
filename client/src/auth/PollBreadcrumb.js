import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth from '../auth/auth-helper';
import { Breadcrumb } from 'antd';

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return { color: '#28079d' };
  else
    return { color: '#1890FF' };
};

const PollBreadcrumb = withRouter(({ history }) => (
  <>
    {
      auth.isAuthenticated() && (auth.isAuthenticated().user.role === 'admin' || auth.isAuthenticated().user.role === 'powerUser') && (
        <div className='breadcrumb'>
          <div className='bread-container'>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/manage-polls" style={isActive(history, '/manage-polls')}>Manage Polls</Link>
              </Breadcrumb.Item>
              {auth.isAuthenticated() && auth.isAuthenticated().user.role === 'admin' && <Breadcrumb.Item>
                <Link to="/manage-users" style={isActive(history, '/manage-users')}>Manage Users</Link>
              </Breadcrumb.Item>}
            </Breadcrumb>
          </div>
        </div>
      )
    }
  </>
));


export default PollBreadcrumb;
