import React from 'react';
import PropTypes from 'prop-types';

import styles from './SearchBar.module.scss';

const SearchBar = props => {
  return (
    <div className={styles.SearchBar}>
      <form onSubmit={props.handleSearch}>
        <input
          name="gene"
          placeholder="Gene Name"
          value={props.gene}
          onChange={props.handleInputChange}
        />
        <button onClick={props.handleSearch}>Search</button>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  gene: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired
};

export default SearchBar;
