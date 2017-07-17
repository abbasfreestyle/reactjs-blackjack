import React, { Component } from 'react';

import './hand.css';

class Hand extends Component {
  render() {
    const {header, score, children} = this.props;
    return (
        <div className="hand">
          <header className="header">{header}</header>
          {score ? <header className="header">Score: {score}</header> : null}
          {children}
        </div>
    );
  }
}

export {Hand};
