import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './ToolBar.module.scss';
import * as searchActions from '../../store/actions/searchActions';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../UI/Button/Button';

const mapStateToProps = state => ({
  isLoadingSuggestions: state.search.isLoadingSuggestions,
  headers: state.search.headers,
  suggestions: state.search.suggestions
});

const mapDispatchToProps = {
  onSearch: searchActions.search,
  onSuggest: searchActions.suggest,
  onResetSuggestions: searchActions.resetSuggestions
};

class ToolBar extends Component {
  static propTypes = {
    isLoadingSuggestions: PropTypes.bool.isRequired,
    suggestions: PropTypes.array.isRequired,
    headers: PropTypes.object.isRequired,
    handleToggleDrawer: PropTypes.func.isRequired,
    onResetSuggestions: PropTypes.func.isRequired,
    onSuggest: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
  };

  state = {
    gene: ''
  };

  handleInputChange = event => {
    const gene = event.target.value;
    this.setState({ gene });
    if (!gene) this.props.onResetSuggestions();
    else this.props.onSuggest(gene);
  };

  handleSearch = event => {
    if (event) event.preventDefault();
    if (!this.state.gene) return;

    // Copy headers
    const headers = {};
    Object.keys(this.props.headers).forEach(key => {
      headers[key] = { ...this.props.headers[key] };
    });

    this.props.onSearch(this.state.gene, headers);
  };

  render() {
    return (
      <div className={styles.ToolBar}>
        <div className={styles.DrawerToggleContainer}>
          <Button clear circle click={this.props.handleToggleDrawer}>
            <div className="material-icons">menu</div>
          </Button>
        </div>
        <div className={styles.SearchBarContainer}>
          <SearchBar
            isLoadingSuggestions={this.props.isLoadingSuggestions}
            gene={this.state.gene}
            suggestions={this.props.suggestions}
            handleInputChange={this.handleInputChange}
            handleSearch={this.handleSearch}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolBar);
