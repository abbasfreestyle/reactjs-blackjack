import React, { Component } from 'react';
import {GreenBoard, Card, Button, Hand, Title, Result} from './components';

import './blackjackapp.css';

class BlackJackApp extends Component {
  constructor(props){
    super(props)
    this.cards = {
      Ace:{symbol:"A",value:11},
      Jack:{symbol:"J",value:10},
      Queen:{symbol:"Q",value:10},
      King:{symbol:"K",value:10},
      Two:{symbol:"2",value:2},
      Three:{symbol:"3",value:3},
      Four:{symbol:"4",value:4},
      Five:{symbol:"5",value:5},
      Six:{symbol:"6",value:6},
      Seven:{symbol:"7",value:7},
      Eight:{symbol:"8",value:8},
      Nine:{symbol:"9",value:9},
    };
    this.suit = {
      h:{suit: 'hearts'},
      d:{suit:'diamonds'},
      c:{suit:'clubs'},
      s:{suit:'spades'}
    };
    this.state = {
      playersHand: [],
      dealersHand: [],
      disableBtn: false,
      replay: false,
      reveal: false,
      playersScore: 0,
      dealersScore: 0,
    };
  }

  componentDidMount(){
    this.setState({replay:true},()=> this.deal());
  }

  deal(){
    this.pickRandomCard('dealersHand');
    this.pickRandomCard('playersHand');
  }

  stick(){
    this.pickRandomCard('dealersHand');
    this.calculate();
  }

  calculate(){
    var player = this.calculateScore('playersHand');
    var dealer = this.calculateScore('dealersHand');

    if (player > 21){
      this.endGame('You Lose! :(')
    } else if (dealer < 22 && player > 21){
      this.endGame('Bust! :(');
    } else if (player === 21){
      this.endGame('BlackJack! :D')
    } else if (dealer === player && player < 22){
      this.endGame('Draw :P');
    } else if (player < 22 && dealer > 21){
        this.endGame('You Win! :D')
    }
    this.setState({playersScore: player, dealersScore: dealer});
  }

  endGame(why){
    this.setState({disableBtn: true, reveal: true, reason: why});
  }

  calculateScore(who){
    var total = 0;
    const hand = this.state[who];
    //first sort the hand
    var handArray = [];
    for (var i in hand) {
      handArray.push(hand[i].value);
    }
    var sortedHand = handArray.sort((a,b)=> a-b);
    for (var i in sortedHand) {
      var value = sortedHand[i];
      //treat ace as 11 first, if it adds > 21 then fallback to 1
      total = total+value;
      if (value === 11 && total > 21){
        total = total-10;
      }
    }
    return total
  }

  pickRandomSuit(){
    var keys = Object.keys(this.suit)
    return this.suit[keys[ keys.length * Math.random() << 0]].suit;
  }

  pickRandomCard(who) {
      var result;
      var copy = JSON.parse(JSON.stringify(this.state[who]));
      var keys = Object.keys(this.cards)
      result = this.cards[keys[ keys.length * Math.random() << 0]];
      result.of = this.pickRandomSuit();
      this.setState({ [who]: [...copy, result]},()=>{
        this.calculate();
        if (this.state.replay){
          //if replay is set to true, deal another card automatically
          this.deal()
          this.setState({replay: false});
        }
      })
  }

  playAgain(){
    this.setState({playersHand: [], dealersHand: [], replay:true, reveal: false, disableBtn: false},()=>this.deal())
  }

  render() {

    // console.log(this.state.dealersHand);
    return (
        <GreenBoard>
          {this.state.reveal && <Result text={this.state.reason} />}
          <Title text="BLACK JACK WITH REACT JS" />
          <div className="buttonContainer">
            <Button text="Hit" disabled={this.state.disableBtn} onClick={()=> this.deal()} />
            <Button text="Stick" disabled={this.state.disableBtn} onClick={()=> this.stick()} />
            <Button text="Play Again" onClick={()=> this.playAgain()} />
          </div>
          {!this.state.reveal ?
          <Hand header="Dealers Hand">
            {this.state.dealersHand.map((card,i)=>{
              var hidden = i > 0 ? true: false;
              return(
              <Card hidden={hidden} key={i.toString()} card={card.symbol} of={card.of} value={card.value}  />
              )
            },this)}
          </Hand>
          :
          <Hand header="Dealers Hand" score={this.state.dealersScore}>
            {this.state.dealersHand.map((card,i)=>
              <Card hidden={false} key={i.toString()} card={card.symbol} of={card.of} value={card.value}  />
            )}
          </Hand>
          }

          <Hand header="Players Hand" score={this.state.playersScore}>
            {this.state.playersHand.map((card,i)=>
              <Card hidden={false} key={i.toString()} card={card.symbol} of={card.of} value={card.value}  />
            )}
          </Hand>
        </GreenBoard>
    );
  }
}

export default BlackJackApp;
