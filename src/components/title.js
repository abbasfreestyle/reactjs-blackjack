import React, { Component } from 'react';

import './title.css';

class Title extends Component {
  render() {
    const {text} = this.props;
    return (
        <header className="title">
          {text}
        </header>
    );
  }
}

export {Title};
