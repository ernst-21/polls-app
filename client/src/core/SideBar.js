import React from 'react';
import { Button } from 'antd';

const SideBar = ({ onClick, component, isSidebarOpen }) => {
  return (
    <aside className={`${isSidebarOpen ? 'sidebar show-sidebar' : 'sidebar'}`}>
      <div className='sidebar-header'>
        <Button onClick={onClick}>CLOSE</Button>
      </div>
      {component}
    </aside>

  );
};

export default SideBar;
