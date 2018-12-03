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
    openGeneIds[geneId] = openGeneIds[geneId] ? 0 : 1;
    this.setState({ openGeneIds });
  };

  renderGridItems = () => {
    if (this.props.searchResults.length === 0) return [];
    const grid = [];
    this.renderHeaders(grid);
    this.renderSearchResults(grid);
    return grid;
  };

  renderHeaders = grid => {
    Object.entries(this.props.headers).forEach((header, index) => {
      if (!(header[1].isFetched && header[1].isHeader)) return;
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
    });
  };

  renderSearchResults = grid => {
    let isDarkRow = false;
    this.props.searchResults.forEach((result, index1) => {
      Object.keys(this.props.desiredHeaders).forEach((key, index2) => {
        if (!this.props.headers[key].isHeader) return;

        let click = null;
        if (key === 'Nucleotide Change')
          click = this.getShowVariantsHandler(result._id);

        grid.push(
          <SearchGridItem
            key={index1 + ' ' + index2}
            type={key}
            isDarkRow={isDarkRow}
            isCondensed={this.props.isCondensed}
            openGeneIds={this.state.openGeneIds}
            result={result}
            click={click}
          />
        );
      });
      isDarkRow = !isDarkRow;
    });
  };

  render() {
    let grid = null;
    if (this.props.isLoadingSearchResults) {
      grid = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader} />
        </div>
      );
    } else {
      const numCols = this.props.numCols;
      const style = { gridTemplateColumns: `repeat(${numCols}, 1fr)` };
      const gridItems = this.renderGridItems();
      grid = (
        <div style={style} className={styles.SearchGrid}>
          {gridItems}
        </div>
      );
    }

    return <div className={styles.SearchGridContainer}>{grid}</div>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchGrid);
