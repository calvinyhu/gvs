import React from 'react';
import PropTypes from 'prop-types';

import styles from './ToolBar.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../UI/Button/Button';

const ToolBar = props => {
  return (
    <div className={styles.ToolBar}>
      <div className={styles.DrawerToggleContainer}>
        <Button clear circle click={props.handleToggleDrawer}>
          <div className="material-icons">menu</div>
        </Button>
      </div>
      <div className={styles.SearchBarContainer}>
        <SearchBar
          gene={props.gene}
          suggestions={props.suggestions}
          handleInputChange={props.handleInputChange}
          handleSearch={props.handleSearch}
        />
      </div>
    </div>
  );
};

ToolBar.propTypes = {};

export default ToolBar;
