import React from 'react';
import { Drawer } from 'antd';

const SideDrawer = ({component, isSideDrawerOpen, onDrawerClose, width}) => {
  return (
    <div>
      <Drawer
        width={width}
        placement="right"
        closable={false}
        onClose={onDrawerClose}
        visible={isSideDrawerOpen}
      >{component}</Drawer>
    </div>
  );
};

export default SideDrawer;
