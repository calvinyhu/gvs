import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './SearchGridItem.module.scss';

class SearchGridItem extends Component {
  state = {
    isMouse: false
  };

  handleMouseEnter = () => this.setState({ isMouse: true });
  handleMouseLeave = () => this.setState({ isMouse: false });

  renderNucleotideChange = result => {
    const carrotClasses = classnames({
      [styles.Carrot]: true,
      [styles.Rotate90]: this.props.openGeneIds[result._id]
    });
    const carrot = (
      <div className={carrotClasses}>
        <div className="material-icons">chevron_right</div>
      </div>
    );
    let otherMappings = [];
    if (result) {
      otherMappings = result['Other Mappings'].split(',');
      otherMappings = otherMappings.map((variant, index) => (
        <p key={index}>{variant}</p>
      ));
    }
    const variantClasses = classnames({
      [styles.Variants]: true,
      [styles.isOpen]: this.props.openGeneIds[result._id]
    });
    const variants = <div className={variantClasses}>{otherMappings}</div>;
    const commentClasses = classnames({
      [styles.Comment]: true,
      [styles.ShowComment]: this.state.isMouse
    });
    const submitterComment = result['Submitter Comment'];
    const comment = (
      <div className={commentClasses}>
        <p>{submitterComment ? submitterComment : 'No comment.'}</p>
      </div>
    );
    return { carrot, variants, comment };
  };

  render = () => {
    const result = this.props.result;
    const type = this.props.type;

    let icon = null;
    let name = <p>{result[type] ? result[type] : '-'}</p>;
    let moreInfo = null;
    let toolTip = null;
    let mouseEnter = null;
    let mouseLeave = null;

    if (type === 'Nucleotide Change') {
      const { carrot, variants, comment } = this.renderNucleotideChange(result);
      icon = carrot;
      moreInfo = variants;
      toolTip = comment;
      mouseEnter = this.handleMouseEnter;
      mouseLeave = this.handleMouseLeave;
    } else if (type === 'Source') {
      name = (
        <a href={result.URL} target="_blank" rel="noopener noreferrer">
          {result[type] ? result[type] : '-'}
        </a>
      );
    }

    const entryClasses = classnames({
      [styles.EntryName]: true,
      [styles.NucleotideChange]: type === 'Nucleotide Change'
    });
    const entry = (
      <div className={entryClasses} onClick={this.props.click}>
        {icon}
        {name}
      </div>
    );

    const gridItemClasses = classnames({
      [styles.SearchGridItem]: true,
      [styles.DarkRow]: this.props.isDarkRow,
      [styles.Condensed]: this.props.isCondensed
    });

    return (
      <div
        className={gridItemClasses}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        {entry}
        {moreInfo}
        {toolTip}
      </div>
    );
  };
}

SearchGridItem.propTypes = {
  isDarkRow: PropTypes.bool.isRequired,
  isCondensed: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  openGeneIds: PropTypes.object.isRequired,
  result: PropTypes.object.isRequired,
  click: PropTypes.func
};

export default SearchGridItem;
