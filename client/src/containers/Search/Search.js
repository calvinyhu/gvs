import React, { Component } from 'react';
import axios from 'axios';

import styles from './Search.module.scss';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';
import SearchGridHeader from '../../components/SearchGridHeader/SearchGridHeader';
import SearchGridItem from '../../components/SearchGridItem/SearchGridItem';
import Drawer from '../../components/UI/Drawer/Drawer';
import Button from '../../components/UI/Button/Button';
import geneHeaders from '../../database/geneHeaders';

class Search extends Component {
  state = {
    isLoading: false,
    isDrawerOpen: false,
    isSelectAll: false,
    gene: '',
    headers: geneHeaders,
    desiredHeaders: {},
    sortedHeader: { name: '', isAscending: false },
    openGeneId: '',
    searchResults: [],
    suggestions: [],
    error: {}
  };

  handleInputChange = event => {
    if (!event) return;
    const targetName = event.target.name;
    const targetVal = event.target.value;

    if (targetName === 'gene') {
      this.setState({ [targetName]: targetVal });
      if (!targetVal) {
        this.setState({ suggestions: [] });
        return;
      }
      const suggestionEndpoint = 'http://localhost:5000/api/search/suggestion';
      const data = { gene: targetVal };
      axios
        .post(suggestionEndpoint, data)
        .then(response =>
          this.setState({ suggestions: response.data.suggestions })
        )
        .catch(error => this.setState({ error }));
    } else if (this.state.headers[targetName]) {
      const headers = {};
      Object.keys(this.state.headers).forEach(key => {
        headers[key] = { ...this.state.headers[key] };
      });
      headers[targetName].isChecked = !this.state.headers[targetName].isChecked;
      if (targetName === 'Source')
        headers.URL.isChecked = !this.state.headers[targetName].isChecked;
      if (targetName === 'Nucleotide Change')
        headers['Other Mappings'].isChecked = !this.state.headers[targetName]
          .isChecked;
      this.setState({ headers });
    } else if (targetName === 'Select All') {
      const checkedOrNot = this.state.isSelectAll ? 0 : 1;
      const headers = {};
      Object.keys(this.state.headers).forEach(key => {
        headers[key] = { ...this.state.headers[key], isChecked: checkedOrNot };
      });
      this.setState({ isSelectAll: Boolean(checkedOrNot), headers });
    }
  };

  handleSearch = event => {
    if (event) event.preventDefault();
    if (!this.state.gene) return;

    // Prep data
    const searchEndpoint = 'http://localhost:5000/api/search';
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
    const data = { gene: this.state.gene, desiredHeaders };

    // Make request
    this.setState({ isLoading: true, headers, desiredHeaders });
    axios
      .post(searchEndpoint, data)
      .then(response =>
        this.setState({ searchResults: response.data.genes, isLoading: false })
      )
      .catch(error => this.setState({ error, isLoading: false }));
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
    const numCols = Object.values(this.state.headers).filter(
      header => header.isFetched && header.isHeader
    ).length;

    this.state.searchResults.forEach((result, index1) => {
      let colsPushed = 0;
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
            entryValue={String(entry[1])}
            result={result}
            click={click}
          />
        );
        colsPushed++;
      });
      if (colsPushed !== numCols - 1) {
        console.log(colsPushed, numCols);
      }
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
    return (
      <div
        style={{ gridTemplateColumns: `repeat(${checkboxes.length},1fr)` }}
        className={styles.HeaderCheckboxes}
      >
        {checkboxes}
      </div>
    );
  };

  render() {
    let loader = null;
    let headerCheckboxes = this.renderHeaderCheckboxes();
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
                  header => header.isFetched && header.isHeader
                ).length
              }
              searchResults={grid}
            />
          )}
        </div>
        <div className={styles.DrawerToggleContainer}>
          <Button clear circle click={this.handleToggleDrawer}>
            <div className="material-icons">menu</div>
          </Button>
        </div>
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
            {headerCheckboxes}
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Search;
