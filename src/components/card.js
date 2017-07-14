import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './card.css';

class Card extends Component {

  suit(){
    switch(this.props.of) {
      case 'hearts': return '\u2665';
      break;
      case 'diamonds': return "\u2666";
      break;
      case 'spades': return "\u2660";
      break;
      case 'clubs': return "\u2663";
      break;
    }
  }

  color(){
    const {of} = this.props;
    return of === 'hearts' || of === 'diamonds' ? 'red' : 'black';
  }

  render() {
    const {hidden, card} = this.props;
    return (
          <div className="card">
            <div className="topLeftSymbol" style={{color:this.color(),visibility: hidden && 'hidden'}}>{card} {this.suit()}</div>
            <div className="mainNumber" style={{color:this.color(),visibility: hidden && 'hidden'}}>{card}</div>
            <div className="bottomRightSymbol" style={{color:this.color(),visibility: hidden && 'hidden'}}>{card} {this.suit()}</div>
          </div>
    );
  }
}

export {Card};
