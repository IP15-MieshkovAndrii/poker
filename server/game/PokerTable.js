const Deck = require("./Deck.js");

class PokerTable {
    constructor() {
      this.deck = new Deck();
      this.players = [];
      this.communityCards = [];
      this.dealerIndex = 0;
      this.smallBlind = 1;
      this.bigBlind = 2;
      this.currentPlayer = 0;
      this.potSize = 0;
    }
  
    addPlayer(player) {
      this.players.push(player);
    }

    getPlayers() {
      return this.players
    };
    getSmallBlind() {
      return this.smallBlind;
    };
    getBigBlind() {
      return this.bigBlind;
    };

    leaveGame(playerName) {
      const playerIndex = this.players.findIndex(player => player.getName() === playerName);

      if (playerIndex !== -1) {
        this.players.splice(playerIndex, 1);

        if (playerName === this.dealer) {
          this.nextDealer();
        }
      }
    }

    newHands() {
      this.players.forEach(player => {
        player.resetHand();
      });
  
      for (let i = 0; i < 2; i++) {
        this.players.forEach(player => {
          const card = this.deck.dealCard();
          player.receiveCard(card);
        });
      }
    }

    emitPlayers(){
      let returnArr = [];
      let dealerIndex = this.dealerIndex;
      let pot = this.potSize;
      returnArr.push(dealerIndex, pot);
      let currPerson;
      for(let i = 0; i < this.getPlayers().length; i++) {
          currPerson = this.players[i];
          let holeCard1;
          let holeCard2;
          if(currPerson.getHand() == null){
              holeCard1 = "back.png";
              holeCard2 = "back.png"
          }
          else{
              holeCard1 = currPerson.getHand()[0].cardToPNG();
              holeCard2 = currPerson.getHand()[1].cardToPNG();
          }
          
          returnArr.push({
            name: currPerson.getName(), 
            chips: currPerson.getChips(), 
            moneyIn: currPerson.getCurrentBet(), 
            card1: holeCard1, 
            card2: holeCard2, 
            isShown1: false, 
            isShown2: false, 
            isTurn: (this.currentPlayer === i)
          });
      }
      return  returnArr;
  }
  
    evaluateRound() {
    }

    setDealer(dealer) {
      this.dealerIndex = dealer;
    }

    changePot(amount) {
      this.potSize += amount;
      return this.potSize;
    }

    resetPot() {
      const pot = this.potSize;
      this.potSize = 0;
      return pot
    }

    nextDealer() {  
      if (this.dealerIndex === -1 || this.dealerIndex === this.players.length - 1) {
        this.dealerIndex = 0;
      } else {
        this.dealerIndex +=1;
      }
    }

    nextPlayer(i) {
      if (i === -1 || i === this.players.length - 1) {
        this.currentPlayer = 0;
        return 0;
      } else {
        this.currentPlayer = i+1;
        return i+1;
      }
    }
  }
  

  module.exports = PokerTable;
  