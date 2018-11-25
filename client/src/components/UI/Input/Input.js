import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Input.module.scss';

const input = props => {
  input.propTypes = {
    required: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    line: PropTypes.bool,
    small: PropTypes.bool,
    medium: PropTypes.bool,
    margin: PropTypes.bool,
    transparent: PropTypes.bool,
    noError: PropTypes.bool,
    floatText: PropTypes.bool,
    error: PropTypes.string,
    list: PropTypes.string
  };

  const inputGroupClasses = classnames({
    [styles.InputGroup]: true,
    [styles.Margin]: props.margin
  });

  const inputClasses = classnames({
    [styles.Input]: true,
    [styles.Line]: props.line,
    [styles.Small]: props.small,
    [styles.Medium]: props.medium,
    [styles.Transparent]: props.transparent,
    [styles.ErrorOutline]: props.error
  });

  // Label
  let label = null;
  if (props.floatText) {
    label = (
      <label className={styles.InputPlaceholder} htmlFor={props.name}>
        {props.placeholder}
      </label>
    );
  }

  let error = null;
  if (!props.noError) error = <p className={styles.Error}>{props.error}</p>;

  return (
    <div className={inputGroupClasses}>
      {error}
      <input
        required={props.required}
        className={inputClasses}
        type={props.type}
        name={props.name}
        placeholder={!props.floatText ? props.placeholder : null}
        value={props.value}
        list={props.list}
        onChange={props.change}
      />
      {label}
    </div>
  );
};

export default input;
