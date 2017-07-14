import React, { Component } from 'react';

import './button.css';

class Button extends Component {
  render() {
    const {onClick, disabled, text} = this.props;
    return (
        <button onClick={onClick} disabled={disabled} className="button">
          {text}
        </button>
    );
  }
}

export {Button};
