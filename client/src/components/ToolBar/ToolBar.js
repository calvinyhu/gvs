import React from 'react';
import PropTypes from 'prop-types';

import styles from './ToolBar.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../UI/Button/Button';

const toolBar = props => {
  return (
    <div className={styles.ToolBar}>
      <div className={styles.DrawerToggleContainer}>
        <Button clear circle click={props.handleToggleDrawer}>
          <div className="material-icons">menu</div>
        </Button>
      </div>
      <div className={styles.SearchBarContainer}>
        <SearchBar
          isLoadingSuggestions={props.isLoadingSuggestions}
          gene={props.gene}
          suggestions={props.suggestions}
          handleInputChange={props.handleInputChange}
          handleSearch={props.handleSearch}
        />
      </div>
      <div className={styles.DisplayOption}>
        <label>
          <input
            name="isCondensed"
            type="checkbox"
            checked={props.isCondensed}
            onChange={props.handleInputChange}
          />
          <span />
          Condensed
        </label>
      </div>
    </div>
  );
};

toolBar.propTypes = {
  isLoadingSuggestions: PropTypes.bool.isRequired,
  isCondensed: PropTypes.bool.isRequired,
  gene: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleToggleDrawer: PropTypes.func.isRequired
};

export default toolBar;
