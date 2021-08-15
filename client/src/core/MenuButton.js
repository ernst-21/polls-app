import React, { useState } from 'react';
import SideDrawer from './SideDrawer';
import { MenuOutlined } from '@ant-design/icons';

const MenuButton = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const closeDrawer = () => {
    setCollapsed(false);
  };

  return (
    <div>
      <MenuOutlined onClick={() => setCollapsed(true)} className='hamburger-menu' />
      <SideDrawer
        width={200}
        isSideDrawerOpen={collapsed}
        onDrawerClose={closeDrawer}
        component={props.component}
      />
    </div>
  );
};

export default MenuButton;
