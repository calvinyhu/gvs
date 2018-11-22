import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './SearchGridHeader.module.scss';

const SearchGridHeader = props => {
  const arrowClasses = classnames({
    [styles.Arrow]: true,
    [styles.Rotate]: props.isSorted && !props.isAscending
  });

  const arrow = (
    <div className={arrowClasses}>
      <div className="material-icons">keyboard_arrow_up</div>
    </div>
  );

  const searchGridHeaderClasses = classnames({
    [styles.SearchGridHeader]: true,
    [styles.SortableHeader]: props.isSortable,
    [styles.SortedHeader]: props.isSorted
  });

  return (
    <div
      className={searchGridHeaderClasses}
      onClick={props.isSortable ? props.click : null}
    >
      {props.children}
      {props.isSorted ? arrow : null}
    </div>
  );
};

SearchGridHeader.propTypes = {
  isSortable: PropTypes.number.isRequired,
  isSorted: PropTypes.bool.isRequired,
  isAscending: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
};

export default SearchGridHeader;
