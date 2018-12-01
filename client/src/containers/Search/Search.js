import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Search.module.scss';
import * as searchActions from '../../store/actions/searchActions';
import ToolBar from '../../components/ToolBar/ToolBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';
import Drawer from '../../components/UI/Drawer/Drawer';
import Button from '../../components/UI/Button/Button';

const mapStateToProps = state => ({
  isCondensed: state.search.isCondensed,
  headers: state.search.headers,
  error: state.search.error
});

const mapDispatchToProps = {
  onSetHeaders: searchActions.setHeaders,
  onToggleCondensed: searchActions.toggleCondensed
};

class Search extends Component {
  static propTypes = {
    isCondensed: PropTypes.bool.isRequired,
    headers: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    onSetHeaders: PropTypes.func.isRequired,
    onToggleCondensed: PropTypes.func.isRequired
  };

  state = {
    isDrawerOpen: false,
    isSelectAll: false
  };

  handleInputChange = event => {
    if (!event) return;
    const targetName = event.target.name;
    if (this.props.headers[targetName])
      this.handleHeaderCheckboxChange(targetName);
    else if (targetName === 'Select All') this.handleSelectAllChange();
    else if (targetName === 'isCondensed') this.handleCondensedChange();
  };

  handleHeaderCheckboxChange = targetName => {
    const headers = {};
    Object.keys(this.props.headers).forEach(key => {
      headers[key] = { ...this.props.headers[key] };
    });
    const isChecked = !this.props.headers[targetName].isChecked;
    headers[targetName].isChecked = isChecked;
    if (targetName === 'Source') headers.URL.isChecked = isChecked;
    if (targetName === 'Nucleotide Change') {
      headers['Other Mappings'].isChecked = isChecked;
      headers['Submitter Comment'].isChecked = isChecked;
    }
    this.props.onSetHeaders(headers);
  };

  handleSelectAllChange = () => {
    const isChecked = this.state.isSelectAll ? 0 : 1;
    const headers = {};
    Object.keys(this.props.headers).forEach(key => {
      headers[key] = { ...this.props.headers[key], isChecked };
    });
    this.setState({ isSelectAll: Boolean(isChecked) });
    this.props.onSetHeaders(headers);
  };

  handleCondensedChange = () => {
    this.props.onToggleCondensed(this.props.isCondensed);
  };

  handleToggleDrawer = () => {
    this.setState(prevState => {
      return { isDrawerOpen: !prevState.isDrawerOpen };
    });
  };

  renderHeaderCheckboxes = () => {
    const misc = [];
    misc.push(
      <label className={styles.CheckboxContainer} key={'isCondensed'}>
        <input
          className={styles.Checkbox}
          name="isCondensed"
          type="checkbox"
          checked={this.props.isCondensed}
          onChange={this.handleInputChange}
        />
        <span className={styles.Check} />
        Condensed
      </label>
    );

    misc.push(
      <label className={styles.CheckboxContainer} key={'Select All'}>
        <input
          className={styles.Checkbox}
          name="Select All"
          type="checkbox"
          checked={this.state.isSelectAll}
          onChange={this.handleInputChange}
        />
        <span className={styles.Check} />
        Select All
      </label>
    );

    const headerCheckboxes = [];
    Object.keys(this.props.headers).forEach((key, index) => {
      if (!this.props.headers[key].isHeader) return;
      headerCheckboxes.push(
        <label className={styles.CheckboxContainer} key={index}>
          <input
            className={styles.Checkbox}
            name={key}
            type="checkbox"
            checked={this.props.headers[key].isChecked}
            onChange={this.handleInputChange}
          />
          <span className={styles.Check} />
          {key}
        </label>
      );
    });

    return (
      <div className={styles.Options}>
        <div className={styles.Misc}>{misc}</div>
        <div className={styles.HeaderCheckboxes}>{headerCheckboxes}</div>
      </div>
    );
  };

  render() {
    const toolbar = <ToolBar handleToggleDrawer={this.handleToggleDrawer} />;

    const searchGrid = (
      <div className={styles.SearchGridContainer}>
        <SearchGrid />
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
            <h4>Options</h4>
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
