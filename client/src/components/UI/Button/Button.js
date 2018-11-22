import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Button.module.scss';

class Button extends PureComponent {
  static propTypes = {
    link: PropTypes.bool,
    small: PropTypes.bool,
    circle: PropTypes.bool,
    main: PropTypes.bool,
    clear: PropTypes.bool,
    translucent: PropTypes.bool,
    noShadow: PropTypes.bool,
    leftAlign: PropTypes.bool,
    bold: PropTypes.bool,
    disabled: PropTypes.bool,
    click: PropTypes.func,
    children: PropTypes.any
  };

  isTouched = false;
  touchBounds = { top: 0, bot: 0, left: 0, right: 0 };

  state = {
    isMouse: false,
    isTouch: false
  };

  handleTouchStart = event => {
    const rect = event.target.getBoundingClientRect();
    this.touchBounds.top = rect.top;
    this.touchBounds.bot = rect.bottom;
    this.touchBounds.left = rect.left;
    this.touchBounds.right = rect.right;

    this.setState({ isTouch: true });
  };

  handleTouchEnd = event => {
    if (event && event.cancelable) event.preventDefault();

    const touch = event.changedTouches[0];
    const withinX =
      touch.clientX <= this.touchBounds.right &&
      touch.clientX >= this.touchBounds.left;
    const withinY =
      touch.clientY <= this.touchBounds.bot &&
      touch.clientY >= this.touchBounds.top;

    if (this.props.click && withinX && withinY) this.props.click(event);

    this.setState({ isTouch: false });
  };

  handleMouseEnter = () => this.setState({ isMouse: true });
  handleMouseLeave = () => this.setState({ isMouse: false });

  render() {
    const buttonClasses = classnames({
      [styles.Button]: true,
      [styles.Link]: this.props.link,
      [styles.Small]: this.props.small,
      [styles.Circle]: this.props.circle,
      [styles.Main]: this.props.main,
      [styles.Clear]: this.props.clear,
      [styles.Translucent]: this.props.translucent,
      [styles.NoShadow]: this.props.noShadow,
      [styles.FlexStart]: this.props.leftAlign,
      [styles.Bold]: this.props.bold,
      [styles.MainTouchHover]: this.state.isTouch && this.props.main,
      [styles.ClearTouchHover]: this.state.isTouch && this.props.clear,
      [styles.TranslucentTouchHover]:
        this.state.isTouch && this.props.translucent,
      [styles.MainMouseHover]: this.state.isMouse && this.props.main,
      [styles.ClearMouseHover]: this.state.isMouse && this.props.clear,
      [styles.TranslucentMouseHover]:
        this.state.isMouse && this.props.translucent
    });

    return (
      <button
        id={this.props.id}
        name={this.props.name}
        className={buttonClasses}
        disabled={this.props.disabled}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.props.click}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
