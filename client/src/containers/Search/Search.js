import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import styles from './Search.module.scss';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';

class Search extends Component {
  state = {
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
    axios
      .post(searchEndpoint, data)
      .then(response => this.setState({ searchResults: response.data.genes }))
      .catch(error => this.setState({ error }));
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

  renderSearchResults = () => {
    if (this.state.searchResults.length === 0) return [];

    const searchResults = [];

    // Push Headers
    Object.entries(this.state.headers).forEach((header, index) => {
      if (header[1].isFetch && header[1].isHeader) {
        const isSortable = this.state.headers[header[0]].isSortable;
        const isSorted = this.state.sortedHeader.name === header[0];

        const arrowClasses = classnames({
          [styles.Arrow]: true,
          [styles.Rotate]: isSorted && !this.state.sortedHeader.isAscending
        });

        const arrow = (
          <div className={arrowClasses}>
            <div className="material-icons">keyboard_arrow_up</div>
          </div>
        );

        const searchGridHeaderClasses = classnames({
          [styles.SearchGridHeader]: true,
          [styles.SortableHeader]: isSortable,
          [styles.SortedHeader]: isSorted
        });

        let onClick = null;
        if (isSortable) onClick = this.getSortHandler(header[0]);

        searchResults.push(
          <div
            key={index}
            className={searchGridHeaderClasses}
            onClick={onClick}
          >
            {header[0]}
            {isSorted ? arrow : null}
          </div>
        );
      }
    });

    // Push Results
    this.state.searchResults.forEach((result, index1) => {
      Object.entries(result).forEach((entry, index2) => {
        if (!this.state.headers[entry[0]]) return;
        if (!this.state.headers[entry[0]].isHeader) return;

        let onClick = null;
        const isNucleotideChange = entry[0] === 'Nucleotide Change';
        if (isNucleotideChange)
          onClick = this.getShowVariantsHandler(result._id);

        const gridItemClasses = classnames({
          [styles.SearchGridItem]: true,
          [styles.NucleotideChange]: isNucleotideChange
        });

        const carrotClasses = classnames({
          [styles.Carrot]: true,
          [styles.Rotate90]: this.state.openGeneId === result._id
        });
        const carrot = (
          <div className={carrotClasses}>
            <div className="material-icons">chevron_right</div>
          </div>
        );

        const entryName = (
          <div className={styles.EntryName}>
            {isNucleotideChange ? carrot : null}
            <p>{entry[1] ? entry[1] : '-'}</p>
          </div>
        );

        const variantClasses = classnames({
          [styles.Variants]: true,
          [styles.isOpen]: this.state.openGeneId === result._id
        });
        let variants = null;
        if (isNucleotideChange) {
          let otherMappings = result['Other Mappings'].split(',');
          otherMappings = otherMappings.map((variant, index) => (
            <p key={index}>{variant}</p>
          ));
          variants = <div className={variantClasses}>{otherMappings}</div>;
        }

        searchResults.push(
          <div
            key={index1 + ' ' + index2}
            className={gridItemClasses}
            onClick={onClick}
          >
            {entryName}
            {variants}
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
          suggestions={this.state.suggestions}
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
