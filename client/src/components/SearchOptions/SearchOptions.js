import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './SearchOptions.module.scss';
import Checkbox from '../UI/Checkbox/Checkbox';

const mapStateToProps = state => ({
  isCondensed: state.search.isCondensed,
  headers: state.search.headers
});

class SearchOptions extends Component {
  static propTypes = {
    isCondensed: PropTypes.bool.isRequired,
    headers: PropTypes.object.isRequired
  };

  renderGridOptions = () => {
    const gridOptions = [];
    gridOptions.push(
      <Checkbox
        key="Condensed"
        name="isCondensed"
        label="Condensed"
        checked={this.props.isCondensed}
        change={this.props.change}
      />
    );
    gridOptions.push(
      <Checkbox
        key="Select All"
        name="Select All"
        label="Select All"
        checked={this.props.isSelectAll}
        change={this.props.change}
      />
    );
    return <div className={styles.Misc}>{gridOptions}</div>;
  };

  renderHeaderOptions = () => {
    const headerCheckboxes = [];
    Object.keys(this.props.headers).forEach((key, index) => {
      if (!this.props.headers[key].isHeader) return;
      headerCheckboxes.push(
        <Checkbox
          key={index}
          name={key}
          label={key}
          checked={Boolean(this.props.headers[key].isChecked)}
          change={this.props.change}
        />
      );
    });

    return <div className={styles.HeaderCheckboxes}>{headerCheckboxes}</div>;
  };

  render() {
    return (
      <div className={styles.Options}>
        {this.renderGridOptions()}
        {this.renderHeaderOptions()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(SearchOptions);
