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
        drawerStyle={{background: '#778298'}}
        title='Menu'
        width={250}
        placement='left'
        isSideDrawerOpen={collapsed}
        onDrawerClose={closeDrawer}
        component={props.component}
      />
    </div>
  );
};

export default MenuButton;
