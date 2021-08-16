import React, { useState } from 'react';
import SideDrawer from './SideDrawer';
import { MenuOutlined } from '@ant-design/icons';
import MenuItems from './MenuItems';

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
        component={<nav><MenuItems onClick={closeDrawer} history={props.history} className='links-container_vertical' /></nav>}
      />
    </div>
  );
};

export default MenuButton;
