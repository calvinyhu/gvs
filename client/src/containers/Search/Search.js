import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Search.module.scss';
import ToolBar from '../../components/ToolBar/ToolBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';
import SearchGridHeader from '../../components/SearchGridHeader/SearchGridHeader';
import SearchGridItem from '../../components/SearchGridItem/SearchGridItem';
import Drawer from '../../components/UI/Drawer/Drawer';
import Button from '../../components/UI/Button/Button';
import geneHeaders from '../../database/geneHeaders';
import * as searchActions from '../../store/actions/searchActions';

const mapStateToProps = state => ({
  isLoadingSearchResults: state.search.isLoadingSearchResults,
  isLoadingSuggestions: state.search.isLoadingSuggestions,
  searchResults: state.search.searchResults,
  suggestions: state.search.suggestions,
  error: state.search.error
});

const mapDispatchToProps = {
  onSearch: searchActions.search,
  onSuggest: searchActions.suggest,
  onSortSearchResults: searchActions.sortSearchResults,
  onResetSuggestions: searchActions.resetSuggestions
};

class Search extends Component {
  static propTypes = {
    isLoadingSearchResults: PropTypes.bool.isRequired,
    isLoadingSuggestions: PropTypes.bool.isRequired,
    searchResults: PropTypes.array.isRequired,
    suggestions: PropTypes.array.isRequired,
    error: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSuggest: PropTypes.func.isRequired,
    onSortSearchResults: PropTypes.func.isRequired,
    onResetSuggestions: PropTypes.func.isRequired
  };

  state = {
    isDrawerOpen: false,
    isSelectAll: false,
    isCondensed: true,
    gene: '',
    headers: geneHeaders,
    numCols: 0,
    desiredHeaders: {},
    sortedHeader: { name: '', isAscending: false },
    openGeneId: ''
  };

  handleInputChange = event => {
    if (!event) return;
    const targetName = event.target.name;
    const targetVal = event.target.value;
    if (targetName === 'gene') this.handleGeneInputChange(targetVal);
    else if (this.state.headers[targetName])
      this.handleHeaderCheckboxChange(targetName);
    else if (targetName === 'Select All') this.handleSelectAllChange();
    else if (targetName === 'isCondensed') this.handleCondensedChange();
  };

  handleGeneInputChange = gene => {
    this.setState({ gene });
    if (!gene) this.props.onResetSuggestions();
    else this.props.onSuggest(gene);
  };

  handleHeaderCheckboxChange = targetName => {
    const headers = {};
    Object.keys(this.state.headers).forEach(key => {
      headers[key] = { ...this.state.headers[key] };
    });
    const isChecked = !this.state.headers[targetName].isChecked;
    headers[targetName].isChecked = isChecked;
    if (targetName === 'Source') headers.URL.isChecked = isChecked;
    if (targetName === 'Nucleotide Change')
      headers['Other Mappings'].isChecked = isChecked;
    this.setState({ headers });
  };

  handleSelectAllChange = () => {
    const isChecked = this.state.isSelectAll ? 0 : 1;
    const headers = {};
    Object.keys(this.state.headers).forEach(key => {
      headers[key] = { ...this.state.headers[key], isChecked };
    });
    this.setState({ isSelectAll: Boolean(isChecked), headers });
  };

  handleCondensedChange = () => {
    this.setState(prevState => {
      return { isCondensed: !prevState.isCondensed };
    });
  };

  handleSearch = event => {
    if (event) event.preventDefault();
    if (!this.state.gene) return;

    // Prep data
    const headers = {};
    Object.keys(this.state.headers).forEach(key => {
      headers[key] = { ...this.state.headers[key] };
    });
    const desiredHeaders = {};
    Object.entries(this.state.headers).forEach(entry => {
      if (entry[1].isChecked) {
        headers[entry[0]].isFetched = 1;
        desiredHeaders[entry[0]] = 1;
      } else headers[entry[0]].isFetched = 0;
    });
    const numCols = Object.values(headers).filter(
      header => header.isFetched && header.isHeader
    ).length;
    this.setState({
      headers,
      desiredHeaders,
      numCols,
      sortedHeader: { name: '', isAscending: false },
      openGeneId: ''
    });

    // Make Request
    this.props.onSearch(this.state.gene, desiredHeaders);
  };

  handleToggleDrawer = () => {
    this.setState(prevState => {
      return { isDrawerOpen: !prevState.isDrawerOpen };
    });
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
    this.props.searchResults.forEach(result =>
      searchResults.push({ ...result })
    );
    searchResults.sort(this.compare(sortedHeader));
    this.setState({ sortedHeader });

    this.props.onSortSearchResults(searchResults);
  };

  compare = sortedHeader => {
    const header = sortedHeader.name;
    return (a, b) => {
      const left = a[header] ? a[header] : '-';
      const right = b[header] ? b[header] : '-';
      if (left > right) return sortedHeader.isAscending ? 1 : -1;
      if (left < right) return sortedHeader.isAscending ? -1 : 1;
      return 0;
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
    if (this.props.searchResults.length === 0) return [];
    const grid = [];
    this.renderHeaders(grid);
    this.renderSearchResults(grid);
    return grid;
  };

  renderHeaders = grid => {
    Object.entries(this.state.headers).forEach((header, index) => {
      if (header[1].isFetched && header[1].isHeader) {
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
    this.props.searchResults.forEach((result, index1) => {
      Object.keys(this.state.desiredHeaders).forEach((key, index2) => {
        // Skip these since they are not headers and are part of other fields
        if (!this.state.headers[key].isHeader) return;

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
            isCondensed={this.state.isCondensed}
            isNucleotideChange={result[key] ? isNucleotideChange : false}
            isSource={result[key] ? isSource : false}
            openGeneId={result[key] ? this.state.openGeneId : ''}
            entryValue={result[key] ? String(result[key]) : ''}
            result={result[key] ? result : {}}
            click={result[key] ? click : null}
          />
        );
      });
    });
  };

  renderHeaderCheckboxes = () => {
    const checkboxes = [];
    checkboxes.push(
      <label key={-1}>
        <input
          name="Select All"
          type="checkbox"
          checked={this.state.isSelectAll}
          onChange={this.handleInputChange}
        />
        <span />
        Select All
      </label>
    );
    Object.keys(this.state.headers).forEach((key, index) => {
      if (!this.state.headers[key].isHeader) return;
      checkboxes.push(
        <label key={index}>
          <input
            name={key}
            type="checkbox"
            checked={this.state.headers[key].isChecked}
            onChange={this.handleInputChange}
          />
          <span />
          {key}
        </label>
      );
    });
    return <div className={styles.HeaderCheckboxes}>{checkboxes}</div>;
  };

  render() {
    let loader = null;
    let grid = [];
    if (this.props.isLoadingSearchResults) {
      loader = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader} />
        </div>
      );
    } else grid = this.renderGrid();

    const toolbar = (
      <ToolBar
        isLoadingSuggestions={this.props.isLoadingSuggestions}
        isCondensed={this.state.isCondensed}
        gene={this.state.gene}
        suggestions={this.props.suggestions}
        handleInputChange={this.handleInputChange}
        handleSearch={this.handleSearch}
        handleToggleDrawer={this.handleToggleDrawer}
      />
    );

    const searchGrid = (
      <div className={styles.SearchGridContainer}>
        {loader}
        <SearchGrid numCols={this.state.numCols} searchResults={grid} />
      </div>
    );

    const drawer = (
      <Drawer left isOpen={this.state.isDrawerOpen}>
        <div className={styles.DrawerContents}>
          <div className={styles.DrawerHeader}>
            <div className={styles.DrawerCloseContainer}>
              <Button clear circle click={this.handleToggleDrawer}>
                <div className="material-icons">arrow_back</div>
              </Button>
            </div>
            <h4>Categories</h4>
          </div>
          {this.renderHeaderCheckboxes()}
        </div>
      </Drawer>
    );

    return (
      <div className={styles.Search}>
        {toolbar}
        {searchGrid}
        {drawer}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
