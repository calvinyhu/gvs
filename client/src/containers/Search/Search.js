import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Search.module.scss';
import ToolBar from '../../components/ToolBar/ToolBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';
import SearchOptionsDrawer from '../../components/SearchOptionsDrawer/SearchOptionsDrawer';

const mapStateToProps = state => ({
  error: state.search.error
});

class Search extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired
  };

  state = {
    isDrawerOpen: false
  };

  handleToggleDrawer = () => {
    const isDrawerOpen = !this.state.isDrawerOpen;
    this.setState({ isDrawerOpen });
  };

  render() {
    return (
      <div className={styles.Search}>
        <ToolBar handleToggleDrawer={this.handleToggleDrawer} />
        <SearchGrid />
        <SearchOptionsDrawer
          isDrawerOpen={this.state.isDrawerOpen}
          handleToggleDrawer={this.handleToggleDrawer}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Search);
