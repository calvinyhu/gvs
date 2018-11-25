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

  render() {
    let carrot = null;
    let variants = null;
    let comment = null;
    let mouseEnter = null;
    let mouseLeave = null;
    if (this.props.isNucleotideChange) {
      const carrotClasses = classnames({
        [styles.Carrot]: true,
        [styles.Rotate90]: this.props.openGeneId === this.props.result._id
      });
      carrot = (
        <div className={carrotClasses}>
          <div className="material-icons">chevron_right</div>
        </div>
      );

      const variantClasses = classnames({
        [styles.Variants]: true,
        [styles.isOpen]: this.props.openGeneId === this.props.result._id
      });
      let otherMappings = [];
      if (this.props.result) {
        otherMappings = this.props.result['Other Mappings'].split(',');
        otherMappings = otherMappings.map((variant, index) => (
          <p key={index}>{variant}</p>
        ));
      }
      variants = <div className={variantClasses}>{otherMappings}</div>;

      const commentClasses = classnames({
        [styles.Comment]: true,
        [styles.ShowComment]: this.state.isMouse
      });
      comment = (
        <div className={commentClasses}>
          <p>
            {this.props.result['Submitter Comment']
              ? this.props.result['Submitter Comment']
              : 'No comment.'}
          </p>
        </div>
      );

      mouseEnter = this.handleMouseEnter;
      mouseLeave = this.handleMouseLeave;
    }

    let sourceLink = null;
    if (this.props.isSource) {
      sourceLink = (
        <a
          href={this.props.result.URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {this.props.entryValue ? this.props.entryValue : '-'}
        </a>
      );
    }

    const entryNameClasses = classnames({
      [styles.EntryName]: true,
      [styles.NucleotideChange]: this.props.isNucleotideChange
    });
    const entryName = (
      <div className={entryNameClasses} onClick={this.props.click}>
        {carrot}
        {this.props.isSource ? (
          sourceLink
        ) : (
          <p>{this.props.entryValue ? this.props.entryValue : '-'}</p>
        )}
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
        {entryName}
        {variants}
        {comment}
      </div>
    );
  }
}

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
