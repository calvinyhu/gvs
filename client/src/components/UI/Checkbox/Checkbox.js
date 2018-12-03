import React from 'react';
import PropTypes from 'prop-types';

import styles from './Checkbox.module.scss';

const checkbox = props => {
  checkbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired
  };

  return (
    <label className={styles.CheckboxContainer}>
      <input
        className={styles.Checkbox}
        name={props.name}
        type="checkbox"
        checked={props.checked}
        onChange={props.change}
      />
      <span className={styles.Check} />
      {props.label}
    </label>
  );
};

export default checkbox;
