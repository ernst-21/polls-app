import React from 'react';
import { CSSTransition } from 'react-transition-group';
import {CloseOutlined} from '@ant-design/icons';

const SideBar = ({ onClick, component, isSidebarOpen }) => {
  return (
    <CSSTransition
      timeout={200}
      classNames="slide-in-right"
      in={isSidebarOpen}
      mountOnEnter
      unmountOnExit
    >
      <aside className='sidebar'>
        <div className='sidebar-header'>
          <CloseOutlined style={{fontSize: '20px'}} onClick={onClick}/>
        </div>
        {component}
      </aside>
    </CSSTransition>
  );
};

export default SideBar;
