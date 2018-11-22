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
    let otherMappings = props.result['Other Mappings'].split(',');
    otherMappings = otherMappings.map((variant, index) => (
      <p key={index}>{variant}</p>
    ));
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

  const entryName = (
    <div className={styles.EntryName}>
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
    [styles.NucleotideChange]: props.isNucleotideChange
  });

  return (
    <div className={gridItemClasses} onClick={props.click}>
      {entryName}
      {variants}
    </div>
  );
};

SearchGridItem.propTypes = {
  isDarkRow: PropTypes.bool.isRequired,
  isNucleotideChange: PropTypes.bool.isRequired,
  isSource: PropTypes.bool.isRequired,
  openGeneId: PropTypes.string.isRequired,
  entryValue: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired
};

export default SearchGridItem;
