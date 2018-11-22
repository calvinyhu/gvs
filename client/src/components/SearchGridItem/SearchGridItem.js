import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './SearchGridItem.module.scss';

const SearchGridItem = props => {
  let carrot = null;
  let variants = null;
  if (props.isNucleotideChange) {
    const carrotClasses = classnames({
      [styles.Carrot]: true,
      [styles.Rotate90]: props.openGeneId === props.result._id
    });
    carrot = (
      <div className={carrotClasses}>
        <div className="material-icons">chevron_right</div>
      </div>
    );

    const variantClasses = classnames({
      [styles.Variants]: true,
      [styles.isOpen]: props.openGeneId === props.result._id
    });
    let otherMappings = [];
    if (props.result) {
      otherMappings = props.result['Other Mappings'].split(',');
      otherMappings = otherMappings.map((variant, index) => (
        <p key={index}>{variant}</p>
      ));
    }
    variants = <div className={variantClasses}>{otherMappings}</div>;
  }

  let sourceLink = null;
  if (props.isSource) {
    sourceLink = (
      <a href={props.result.URL} target="_blank" rel="noopener noreferrer">
        {props.entryValue ? props.entryValue : '-'}
      </a>
    );
  }

  const entryNameClasses = classnames({
    [styles.EntryName]: true,
    [styles.NucleotideChange]: props.isNucleotideChange
  });
  const entryName = (
    <div className={entryNameClasses} onClick={props.click}>
      {carrot}
      {props.isSource ? (
        sourceLink
      ) : (
        <p>{props.entryValue ? props.entryValue : '-'}</p>
      )}
    </div>
  );

  const gridItemClasses = classnames({
    [styles.SearchGridItem]: true,
    [styles.DarkRow]: props.isDarkRow,
    [styles.Condensed]: props.isCondensed
  });

  return (
    <div className={gridItemClasses}>
      {entryName}
      {variants}
    </div>
  );
};

SearchGridItem.propTypes = {
  isDarkRow: PropTypes.bool.isRequired,
  isCondensed: PropTypes.bool.isRequired,
  isNucleotideChange: PropTypes.bool.isRequired,
  isSource: PropTypes.bool.isRequired,
  openGeneId: PropTypes.string.isRequired,
  entryValue: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired,
  click: PropTypes.func
};

export default SearchGridItem;
