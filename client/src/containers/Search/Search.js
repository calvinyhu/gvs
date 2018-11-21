import React, { Component } from 'react';
import axios from 'axios';

import styles from './Search.module.scss';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';

class Search extends Component {
  state = {
    gene: '',
    headers: {
      Gene: { isFetch: 1, isHeader: 1 },
      'Nucleotide Change': { isFetch: 1, isHeader: 1 },
      'Protein Change': { isFetch: 1, isHeader: 1 },
      'Other Mappings': { isFetch: 1, isHeader: 0 },
      Alias: { isFetch: 1, isHeader: 1 },
      Transcripts: { isFetch: 0, isHeader: 1 },
      Region: { isFetch: 1, isHeader: 1 },
      'Reported Classification': { isFetch: 1, isHeader: 1 },
      'Inferred Classification': { isFetch: 1, isHeader: 1 },
      Source: { isFetch: 1, isHeader: 1 },
      'Last Evaluated': { isFetch: 1, isHeader: 1 },
      'Last Updated': { isFetch: 1, isHeader: 1 },
      URL: { isFetch: 1, isHeader: 0 },
      'Submitter Comment': { isFetch: 0, isHeader: 1 },
      Assembly: { isFetch: 0, isHeader: 1 },
      Chr: { isFetch: 0, isHeader: 1 },
      'Genomic Start': { isFetch: 0, isHeader: 1 },
      'Genomic Stop': { isFetch: 0, isHeader: 1 },
      Ref: { isFetch: 0, isHeader: 1 },
      Alt: { isFetch: 0, isHeader: 1 },
      Accession: { isFetch: 0, isHeader: 1 },
      'Reported Ref': { isFetch: 0, isHeader: 1 },
      'Reported Alt': { isFetch: 0, isHeader: 1 }
    },
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
    const desiredHeaders = {};
    Object.entries(this.state.headers).forEach(entry => {
      if (entry[1].isFetch) desiredHeaders[entry[0]] = 1;
    });
    const data = { gene: this.state.gene, desiredHeaders };

    axios
      .post(searchEndpoint, data)
      .then(response => this.setState({ searchResults: response.data.genes }))
      .catch(error => this.setState({ error }));
  };

  renderSearchResults = () => {
    if (this.state.searchResults.length === 0) return [];

    const searchResults = [];

    // Push Headers
    Object.entries(this.state.headers).forEach((header, index) => {
      if (header[1].isFetch && header[1].isHeader) {
        searchResults.push(
          <div key={index} className={styles.SearchGridHeader}>
            {header[0]}
          </div>
        );
      }
    });

    // Push Results
    this.state.searchResults.forEach((result, index1) => {
      Object.entries(result).forEach((entry, index2) => {
        if (!this.state.headers[entry[0]]) return;
        if (!this.state.headers[entry[0]].isHeader) return;

        searchResults.push(
          <div key={index1 + ' ' + index2} className={styles.SearchGridItem}>
            {entry[1] ? entry[1] : '-'}
          </div>
        );
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
            numCols={
              Object.values(this.state.headers).filter(
                header => header.isFetch && header.isHeader
              ).length
            }
            searchResults={searchResults}
          />
        </div>
      </div>
    );
  }
}

export default Search;
