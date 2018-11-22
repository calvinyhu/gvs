import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Drawer.module.scss';

const drawer = props => {
  const drawerClasses = classnames({
    [styles.LeftDrawer]: props.left,
    [styles.OpenDrawer]: props.left && props.isOpen,
    [styles.CloseLeftDrawer]: props.left && !props.isOpen,

    [styles.RightDrawer]: props.right,
    [styles.OpenDrawer]: props.right && props.isOpen,
    [styles.CloseRightDrawer]: props.right && !props.isOpen
  });

  return <div className={drawerClasses}>{props.children}</div>;
};

drawer.propTypes = {
  left: PropTypes.bool,
  right: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired
};

export default drawer;
