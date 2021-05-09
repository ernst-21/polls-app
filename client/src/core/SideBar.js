import React from 'react';
import { Button } from 'antd';
import { CSSTransition } from 'react-transition-group';

const SideBar = ({ onClick, component, isSidebarOpen }) => {
  return (
    <CSSTransition
      timeout={200}
      classNames="slide-in-right"
      in={isSidebarOpen}
    >
      <aside className={`${isSidebarOpen ? 'sidebar show-sidebar' : 'sidebar'}`}>
        <div className='sidebar-header'>
          <Button onClick={onClick}>CLOSE</Button>
        </div>
        {component}
      </aside>
    </CSSTransition>
  );
};

export default SideBar;
