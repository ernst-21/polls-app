import React from 'react';
import { Layout } from 'antd';

const {Footer} = Layout;

const FooterComponent = () => {
  return (
    <Footer style={{ backgroundColor: 'white', textAlign: 'center' }} className='footer'>Polls ©2021 Created by Ernst-21</Footer>
  );
};

export default FooterComponent;
