import React, { Component } from 'react';
import axios from 'axios';

import styles from './Search.module.scss';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';
import SearchGridHeader from '../../components/SearchGridHeader/SearchGridHeader';
import SearchGridItem from '../../components/SearchGridItem/SearchGridItem';

class Search extends Component {
  state = {
    isLoading: false,
    gene: '',
    headers: {
      Gene: { isFetch: 1, isHeader: 1, isSortable: 0 },
      'Nucleotide Change': { isFetch: 1, isHeader: 1, isSortable: 1 },
      'Protein Change': { isFetch: 1, isHeader: 1, isSortable: 1 },
      'Other Mappings': { isFetch: 1, isHeader: 0, isSortable: 0 },
      Alias: { isFetch: 1, isHeader: 1, isSortable: 1 },
      Transcripts: { isFetch: 0, isHeader: 1, isSortable: 1 },
      Region: { isFetch: 1, isHeader: 1, isSortable: 1 },
      'Reported Classification': { isFetch: 1, isHeader: 1, isSortable: 1 },
      'Inferred Classification': { isFetch: 1, isHeader: 1, isSortable: 1 },
      Source: { isFetch: 1, isHeader: 1, isSortable: 1 },
      'Last Evaluated': { isFetch: 1, isHeader: 1, isSortable: 1 },
      'Last Updated': { isFetch: 1, isHeader: 1, isSortable: 1 },
      URL: { isFetch: 1, isHeader: 0, isSortable: 1 },
      'Submitter Comment': { isFetch: 0, isHeader: 1, isSortable: 1 },
      Assembly: { isFetch: 0, isHeader: 1, isSortable: 1 },
      Chr: { isFetch: 0, isHeader: 1, isSortable: 1 },
      'Genomic Start': { isFetch: 0, isHeader: 1, isSortable: 1 },
      'Genomic Stop': { isFetch: 0, isHeader: 1, isSortable: 1 },
      Ref: { isFetch: 0, isHeader: 1, isSortable: 1 },
      Alt: { isFetch: 0, isHeader: 1, isSortable: 1 },
      Accession: { isFetch: 0, isHeader: 1, isSortable: 1 },
      'Reported Ref': { isFetch: 0, isHeader: 1, isSortable: 1 },
      'Reported Alt': { isFetch: 0, isHeader: 1, isSortable: 1 }
    },
    sortedHeader: { name: '', isAscending: false },
    openGeneId: '',
    searchResults: [],
    suggestions: [],
    error: {}
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });

    if (!event.target.value) {
      this.setState({ suggestions: [] });
      return;
    }

    const suggestionEndpoint = 'http://localhost:5000/api/search/suggestion';
    const data = { gene: event.target.value };

    axios
      .post(suggestionEndpoint, data)
      .then(response =>
        this.setState({ suggestions: response.data.suggestions })
      )
      .catch(error => this.setState({ error }));
  };

  handleSearch = event => {
    if (event) event.preventDefault();
    if (!this.state.gene) return;

    // Prep data
    const searchEndpoint = 'http://localhost:5000/api/search';
    const desiredHeaders = {};
    Object.entries(this.state.headers).forEach(entry => {
      if (entry[1].isFetch) desiredHeaders[entry[0]] = 1;
    });
    const data = { gene: this.state.gene, desiredHeaders };

    // Make request
    this.setState({ isLoading: true });
    axios
      .post(searchEndpoint, data)
      .then(response =>
        this.setState({ searchResults: response.data.genes, isLoading: false })
      )
      .catch(error => this.setState({ error, isLoading: false }));
  };

  sortHandlers = {};
  getSortHandler = header => {
    if (!this.sortHandlers[header])
      this.sortHandlers[header] = () => this.handleSort(header);
    return this.sortHandlers[header];
  };

  handleSort = header => {
    const sortedHeader = {
      name: header,
      isAscending:
        this.state.sortedHeader.name !== header ||
        !this.state.sortedHeader.isAscending
    };
    const searchResults = [];
    this.state.searchResults.forEach(result =>
      searchResults.push({ ...result })
    );
    searchResults.sort(this.compare(sortedHeader));
    this.setState({ searchResults, sortedHeader });
  };

  compare = sortedHeader => {
    const header = sortedHeader.name;
    return (a, b) => {
      if (sortedHeader.isAscending) {
        if (a[header] > b[header]) return 1;
        if (a[header] < b[header]) return -1;
        return 0;
      } else {
        if (a[header] > b[header]) return -1;
        if (a[header] < b[header]) return 1;
        return 0;
      }
    };
  };

  showVariantsHandlers = {};
  getShowVariantsHandler = geneId => {
    if (!this.showVariantsHandlers[geneId])
      this.showVariantsHandlers[geneId] = () => this.handleShowVariants(geneId);
    return this.showVariantsHandlers[geneId];
  };

  handleShowVariants = geneId => {
    this.setState(prevState => {
      return { openGeneId: prevState.openGeneId === geneId ? '' : geneId };
    });
  };

  renderGrid = () => {
    if (this.state.searchResults.length === 0) return [];
    const grid = [];
    this.renderHeaders(grid);
    this.renderSearchResults(grid);
    return grid;
  };

  renderHeaders = grid => {
    Object.entries(this.state.headers).forEach((header, index) => {
      if (header[1].isFetch && header[1].isHeader) {
        grid.push(
          <SearchGridHeader
            key={index}
            isSortable={this.state.headers[header[0]].isSortable}
            isSorted={this.state.sortedHeader.name === header[0]}
            isAscending={this.state.sortedHeader.isAscending}
            click={this.getSortHandler(header[0])}
          >
            {header[0]}
          </SearchGridHeader>
        );
      }
    });
  };

  renderSearchResults = grid => {
    this.state.searchResults.forEach((result, index1) => {
      Object.entries(result).forEach((entry, index2) => {
        if (!this.state.headers[entry[0]]) return;
        if (!this.state.headers[entry[0]].isHeader) return;

        let click = null;
        const isNucleotideChange = entry[0] === 'Nucleotide Change';
        if (isNucleotideChange) click = this.getShowVariantsHandler(result._id);

        grid.push(
          <SearchGridItem
            key={index1 + ' ' + index2}
            isDarkRow={index1 % 2 === 0}
            isNucleotideChange={isNucleotideChange}
            isSource={entry[0] === 'Source'}
            openGeneId={this.state.openGeneId}
            entryValue={entry[1]}
            result={result}
            click={click}
          />
        );
      });
    });
  };

  render() {
    let loader = null;
    let grid = null;
    if (this.state.isLoading) {
      loader = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader} />
        </div>
      );
    } else grid = this.renderGrid();

    return (
      <div className={styles.Search}>
        <SearchBar
          gene={this.state.gene}
          suggestions={this.state.suggestions}
          handleInputChange={this.handleInputChange}
          handleSearch={this.handleSearch}
        />
        <div className={styles.SearchGridContainer}>
          {this.state.isLoading ? (
            loader
          ) : (
            <SearchGrid
              numCols={
                Object.values(this.state.headers).filter(
                  header => header.isFetch && header.isHeader
                ).length
              }
              searchResults={grid}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Search;
