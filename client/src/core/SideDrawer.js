import React from 'react';
import { Drawer } from 'antd';

const SideDrawer = ({component, isSideDrawerOpen, onDrawerClose}) => {
  return (
    <div>
      <Drawer
        width={540}
        placement="right"
        closable={false}
        onClose={onDrawerClose}
        visible={isSideDrawerOpen}
      >{component}</Drawer>
    </div>
  );
};

export default SideDrawer;
