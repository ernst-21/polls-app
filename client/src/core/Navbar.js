import React from 'react';
import { withRouter } from 'react-router-dom';

import MenuItems from './MenuItems';
import MenuButton from './MenuButton';

const Navbar = withRouter(({ history }) => (
  <nav>
    <MenuButton history={history} />
    <MenuItems history={history} className='links-container_horizontal' />
  </nav>
));

export default Navbar;
