import React from 'react';
import { withRouter } from 'react-router-dom';

import MenuItems from './MenuItems';
import MenuButton from './MenuButton';

const NavbarTest = withRouter(({ history }) => (
  <nav>
    <MenuItems history={history} className='links-container_horizontal' />
    <MenuButton history={history} component={<nav><MenuItems history={history} className='links-container_vertical' /></nav>}/>
  </nav>
));

export default NavbarTest;
