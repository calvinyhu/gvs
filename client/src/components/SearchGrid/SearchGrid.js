import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './SearchGrid.module.scss';
import * as searchActions from '../../store/actions/searchActions';
import SearchGridHeader from '../SearchGridHeader/SearchGridHeader';
import SearchGridItem from '../SearchGridItem/SearchGridItem';

const mapStateToProps = state => ({
  isLoadingSearchResults: state.search.isLoadingSearchResults,
  isCondensed: state.search.isCondensed,
  searchResults: state.search.searchResults,
  headers: state.search.headers,
  desiredHeaders: state.search.desiredHeaders,
  numCols: state.search.numCols
});

const mapDispatchToProps = {
  onSortSearchResults: searchActions.sortSearchResults
};

class SearchGrid extends Component {
  static propTypes = {
    isCondensed: PropTypes.bool.isRequired,
    isLoadingSearchResults: PropTypes.bool.isRequired,
    searchResults: PropTypes.array.isRequired,
    desiredHeaders: PropTypes.object.isRequired,
    headers: PropTypes.object.isRequired,
    numCols: PropTypes.number.isRequired,
    onSortSearchResults: PropTypes.func.isRequired
  };

  state = {
    sortedHeader: { name: '', isAscending: false },
    openGeneIds: {}
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
    this.setState({ sortedHeader });
    this.props.onSortSearchResults(this.props.searchResults, sortedHeader);
  };

  showVariantsHandlers = {};
  getShowVariantsHandler = geneId => {
    if (!this.showVariantsHandlers[geneId])
      this.showVariantsHandlers[geneId] = () => this.handleShowVariants(geneId);
    return this.showVariantsHandlers[geneId];
  };

  handleShowVariants = geneId => {
    const openGeneIds = { ...this.state.openGeneIds };
    if (openGeneIds[geneId]) openGeneIds[geneId] = 0;
    else openGeneIds[geneId] = 1;
    this.setState({ openGeneIds });
  };

  renderGrid = () => {
    if (this.props.searchResults.length === 0) return [];
    const grid = [];
    this.renderHeaders(grid);
    this.renderSearchResults(grid);
    return grid;
  };

  renderHeaders = grid => {
    Object.entries(this.props.headers).forEach((header, index) => {
      if (header[1].isFetched && header[1].isHeader) {
        grid.push(
          <SearchGridHeader
            key={index}
            isSortable={this.props.headers[header[0]].isSortable}
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
    this.props.searchResults.forEach((result, index1) => {
      Object.keys(this.props.desiredHeaders).forEach((key, index2) => {
        // Skip these since they are not headers and are part of other fields
        if (!this.props.headers[key].isHeader) return;

        const isNucleotideChange = key === 'Nucleotide Change';
        const isSource = key === 'Source';
        let click = isNucleotideChange
          ? this.getShowVariantsHandler(result._id)
          : null;

        // Push the same number of items per row as there are number of headers
        grid.push(
          <SearchGridItem
            key={index1 + ' ' + index2}
            isDarkRow={index1 % 2 === 0}
            isCondensed={this.props.isCondensed}
            isNucleotideChange={result[key] ? isNucleotideChange : false}
            isSource={result[key] ? isSource : false}
            openGeneIds={result[key] ? this.state.openGeneIds : {}}
            entryValue={result[key] ? String(result[key]) : ''}
            result={result[key] ? result : {}}
            click={result[key] ? click : null}
          />
        );
      });
    });
  };

  render() {
    if (this.props.isLoadingSearchResults) {
      return (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader} />
        </div>
      );
    }

    return (
      <div
        style={{
          gridTemplateColumns: `repeat(${this.props.numCols}, 1fr)`
        }}
        className={styles.SearchGrid}
      >
        {this.renderGrid()}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchGrid);
