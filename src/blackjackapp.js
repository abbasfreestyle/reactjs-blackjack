import React, { Component } from 'react';
import {GreenBoard, Card, Button, Hand, Title, Result} from './components';

import './blackjackapp.css';

class BlackJackApp extends Component {
  constructor(props){
    //set full pack of cards
    super(props)
    this.deck = [];
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
      Ten: {symbol:"10", value:10},
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
      disableStick: false,
      disableHit: false,
      replay: false,
      reveal: false,
      playersScore: 0,
      dealersScore: 0,
      playerTurn: 0,
      dealerTurn: 0,
    };
  }

  componentDidMount(){
    //create the deck of cards
    this.createDeck();
  }

  createDeck(){
    for (var c in this.cards) {
      for (var s in this.suit) {
        var newCard = {symbol: this.cards[c].symbol, value: this.cards[c].value, suit:this.suit[s].suit}
        this.deck.push(newCard)
      }
    }
    //deal the first 2 cards for player and dealer
    this.startGame();
  }

  startGame(){
    this.pickRandomCard('dealersHand');
    this.pickRandomCard('playersHand');
    setTimeout(()=> {
      this.pickRandomCard('dealersHand');
      this.pickRandomCard('playersHand');
    }, 10);
  }

  hitPlayer(){
    this.state.playerTurn < 5 ? this.pickRandomCard('playersHand') : this.setState({disableHit: true});
  }

  stick(){
    this.setState({disableHit: true, dealerTurn: this.state.dealerTurn+1}, ()=>{
    //loop up to 3 more times for the dealer to reach a maximum of 5 cards
    for (var s = 0; s < 3; s++) {
      var dealer = this.calculateScore('dealersHand');
      //if the dealer reaches 17 or more, reveal the cards and end the game
      if (dealer > 16){
        this.calculate();
        break;
      } else {
        //set a timeout to allow pickRandomCard to finish
        setTimeout(()=>{
          !this.state.reveal && this.pickRandomCard('dealersHand');
        }, 100);
      }
    }
  });
  }

  //the dealer must show after 17+, check to see who wins
  calculate(){
    var player = this.calculateScore('playersHand');
    var dealer = this.calculateScore('dealersHand');
    var turn = this.state.dealerTurn;

      if (player > 21){
        this.endGame('You Lose! :(')
      } else if (dealer < 22 && player > 21){
        this.endGame('Bust! :(');
      } else if (player === 21){
        this.endGame('BlackJack! :D')
      } else if ((dealer === player) && (player < 22) && (dealer > 16) && (turn > 2)){
        this.endGame('Draw :P');
      } else if ((dealer > 16 && dealer < 22) && (player < 22) && (turn > 2)) {
        const result = player > dealer ? 'You Win! :D' : 'You Lose :(';
        const whoWins = player === dealer ? 'Draw! :P' : result;
        this.endGame(whoWins);
      } else if ((player < 22) && (dealer > 21) && (turn > 2)){
          this.endGame('You Win! :D')
      }
    this.setState({playersScore: player, dealersScore: dealer});
  }

  endGame(why){
    this.setState({disableHit: true, disableStick: true, reveal: true, reason: why});
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
    for (var s in sortedHand) {
      var value = sortedHand[s];
      //treat ace as 11 first, if it adds > 21 then fallback to 1
      total = total+value;
      if (value === 11 && total > 21){
        total = total-10;
      }
    }
    return total
  }

  pickRandomCard(who) {
      var turn = who === 'playersHand' ? 'playerTurn' : 'dealerTurn';
      var result;
      var copy = JSON.parse(JSON.stringify(this.state[who]));
      var keys = Object.keys(this.deck)
      result = this.deck[keys[ keys.length * Math.random() << 0]];
      var newTurn = this.state[turn]+1;
      this.setState({ [who]: [...copy, result], [turn]: newTurn},()=>{
        this.calculate();
      })
  }

  playAgain(){
    this.setState({
      playersHand: [],
      dealersHand: [],
      reveal: false,
      disableHit: false,
      disableStick:false,
      playerTurn: 0,
      dealerTurn: 0},
      ()=>this.startGame())
  }

  render() {
    return (
        <GreenBoard>
          {this.state.reveal && <Result text={this.state.reason} />}
          <Title text="BLACK JACK WITH REACT JS" />

          {!this.state.reveal ?
          <Hand header="Dealers Hand">
            {this.state.dealersHand.map((card,i)=>{
              var hidden = i > 0 ? true: false;
              return(
              <Card hidden={hidden} key={i.toString()} card={card.symbol} of={card.suit} value={card.value}  />
              )
            },this)}
          </Hand>
          :
          <Hand header="Dealers Hand" score={this.state.dealersScore}>
            {this.state.dealersHand.map((card,i)=>
              <Card hidden={false} key={i.toString()} card={card.symbol} of={card.suit} value={card.value}  />
            )}
          </Hand>
          }

          <Hand header="Players Hand" score={this.state.playersScore}>
            {this.state.playersHand.map((card,i)=>
              <Card hidden={false} key={i.toString()} card={card.symbol} of={card.suit} value={card.value}  />
            )}
          </Hand>

          <div className="buttonContainer">
            <Button text="Hit" disabled={this.state.disableHit} onClick={()=> this.hitPlayer()} />
            <Button text="Stand" disabled={this.state.disableStick} onClick={()=> this.stick()} />
            <Button text="Play Again" onClick={()=> this.playAgain()} />
          </div>

        </GreenBoard>
    );
  }
}

export default BlackJackApp;
