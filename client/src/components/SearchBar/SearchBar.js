import React from 'react';
import PropTypes from 'prop-types';

import styles from './SearchBar.module.scss';
import Button from '../UI/Button/Button';

const SearchBar = props => {
  const suggestions = {};
  let options = [];

  if (props.suggestions.length > 0) {
    props.suggestions.forEach(suggestion => {
      const gene = suggestion.Gene;
      suggestions[gene] = suggestions[gene] ? ++suggestions[gene] : 1;
    });

    options = Object.keys(suggestions).map((suggestion, index) => (
      <option key={index} value={suggestion} />
    ));
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
          {loader}
        </div>
        <datalist id="suggestions">{options}</datalist>
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
