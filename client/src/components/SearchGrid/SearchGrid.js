import React from 'react';
import PropTypes from 'prop-types';

import styles from './SearchGrid.module.scss';

const SearchGrid = props => {
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${props.numCols}, 1fr)`
      }}
      className={styles.SearchGrid}
    >
      {props.searchResults}
    </div>
  );
};

SearchGrid.propTypes = {
  numCols: PropTypes.number.isRequired,
  searchResults: PropTypes.array.isRequired
};

export default SearchGrid;
