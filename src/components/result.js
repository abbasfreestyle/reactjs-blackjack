import React, { Component } from 'react';

import './result.css';

class Result extends Component {
  render() {
    const {text} = this.props;
    return (
        <div className="modal">
          <div className="text">{text}</div>
        </div>
    );
  }
}

export {Result};
