import React, { useState } from 'react';
import SideDrawer from './SideDrawer';
import {Grid} from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import MenuItems from './MenuItems';

const {useBreakpoint} = Grid;

const MenuButton = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();

  const closeDrawer = () => {
    setCollapsed(false);
  };

  return (
    <div>
      <MenuOutlined onClick={() => setCollapsed(true)} className='hamburger-menu' />
      <SideDrawer
        drawerStyle={{background: '#778298'}}
        title='Menu'
        width={screens.xs === true ? '100%' : '80%'}
        placement='left'
        isSideDrawerOpen={collapsed}
        onDrawerClose={closeDrawer}
        component={<nav><MenuItems onClick={closeDrawer} history={props.history} className='links-container_vertical' /></nav>}
      />
    </div>
  );
};

export default MenuButton;
