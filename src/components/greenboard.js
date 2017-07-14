import React, { Component } from 'react';

import './greenboard.css';

class GreenBoard extends Component {
  render() {
    return (
        <div className="greenboard">
          {this.props.children}
        </div>
    );
  }
}

export {GreenBoard};
