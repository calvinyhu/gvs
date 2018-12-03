import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './SearchOptionsDrawer.module.scss';
import * as searchActions from '../../store/actions/searchActions';
import Drawer from '../UI/Drawer/Drawer';
import Button from '../UI/Button/Button';
import SearchOptions from '../SearchOptions/SearchOptions';

const mapStateToProps = state => ({
  isCondensed: state.search.isCondensed,
  headers: state.search.headers
});

const mapDispatchToProps = {
  onSetHeaders: searchActions.setHeaders,
  onToggleCondensed: searchActions.toggleCondensed
};

class SearchOptionsDrawer extends Component {
  static propTypes = {
    isDrawerOpen: PropTypes.bool.isRequired,
    isCondensed: PropTypes.bool.isRequired,
    headers: PropTypes.object.isRequired,
    handleToggleDrawer: PropTypes.func.isRequired,
    onSetHeaders: PropTypes.func.isRequired,
    onToggleCondensed: PropTypes.func.isRequired
  };

  state = {
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

  render = () => {
    return (
      <Drawer left isOpen={this.props.isDrawerOpen}>
        <div className={styles.DrawerContents}>
          <div className={styles.DrawerHeader}>
            <div className={styles.DrawerCloseContainer}>
              <Button clear circle click={this.props.handleToggleDrawer}>
                <div className="material-icons">arrow_back</div>
              </Button>
            </div>
            <h4>Options</h4>
          </div>
          <SearchOptions
            isSelectAll={this.state.isSelectAll}
            change={this.handleInputChange}
          />
        </div>
      </Drawer>
    );
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchOptionsDrawer);
