import React from 'react';
import PropTypes from 'prop-types';

import styles from './SearchBar.module.scss';
import Button from '../UI/Button/Button';

const SearchBar = props => {
  const options = [];
  if (props.suggestions.length > 0) {
    for (let i = 0; i < 8; i++)
      options.push(<option key={i} value={props.suggestions[i]} />);
  }

  let loader = null;
  if (props.isLoadingSuggestions) {
    loader = (
      <div className={styles.LoaderContainer}>
        <div className={styles.Loader} />
      </div>
    );
  }

  return (
    <div className={styles.SearchBar}>
      <form onSubmit={props.handleSearch}>
        <div className={styles.InputContainer}>
          <input
            type="text"
            name="gene"
            placeholder="Gene Name"
            value={props.gene}
            list="suggestions"
            onChange={props.handleInputChange}
          />
          <datalist id="suggestions">{options}</datalist>
          {loader}
        </div>
        <div className={styles.SearchButtonContainer}>
          <Button
            disabled={!props.gene}
            main
            name="search"
            click={props.handleSearch}
          >
            <div className="material-icons">search</div>
          </Button>
        </div>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  isLoadingSuggestions: PropTypes.bool.isRequired,
  gene: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired
};

export default SearchBar;
