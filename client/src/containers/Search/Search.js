import React, { Component } from 'react';
import axios from 'axios';

import styles from './Search.module.scss';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';

class Search extends Component {
  state = {
    gene: '',
    headers: [
      'Gene',
      'Nucleotide Change',
      'Protein Change',
      'Alias',
      'Region',
      'Reported Classification',
      'Last Evaluated',
      'Last Updated',
      'URL'
    ],
    searchResults: [],
    error: {}
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSearch = event => {
    if (event) event.preventDefault();

    if (!this.state.gene) return;

    const searchEndpoint = 'http://localhost:5000/api/search';
    const data = {
      gene: this.state.gene,
      desiredHeaders: this.state.headers.join(' ')
    };
    // TODO: Headers have spaces cant select fields because we are deliminiting by spaces
    axios
      .post(searchEndpoint, data)
      .then(response => this.setState({ searchResults: response.data.genes }))
      .catch(error => this.setState({ error }));
  };

  renderSearchResults = () => {
    if (this.state.searchResults.length === 0) return [];

    const searchResults = [];

    this.state.headers.forEach((header, index) => {
      searchResults.push(
        <div key={index} className={styles.SearchGridHeader}>
          {header}
        </div>
      );
    });

    this.state.searchResults.forEach((result, index1) => {
      Object.entries(result).forEach((entry, index2) => {
        if (this.state.headers.includes(entry[0])) {
          searchResults.push(
            <div key={index1 + ' ' + index2} className={styles.SearchGridItem}>
              {entry[1] ? entry[1] : '-'}
            </div>
          );
        }
      });
    });

    return searchResults;
  };

  render() {
    const searchResults = this.renderSearchResults();

    return (
      <div className={styles.Search}>
        <SearchBar
          gene={this.state.gene}
          handleInputChange={this.handleInputChange}
          handleSearch={this.handleSearch}
        />
        <div className={styles.SearchGridContainer}>
          <SearchGrid
            numCols={this.state.headers.length}
            searchResults={searchResults}
          />
        </div>
      </div>
    );
  }
}

export default Search;
