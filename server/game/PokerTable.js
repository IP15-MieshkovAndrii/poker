const Deck = require("./Deck.js");

class PokerTable {
    constructor() {
      this.deck = new Deck();
      this.players = [];
      this.communityCards = [];
      this.dealerIndex = 0;
    }
  
    addPlayer(player) {
      this.players.push(player);
    }

    getPlayers() {
      return this.players
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
  
    evaluateRound() {
    }

    setDealer(dealer) {
      this.dealerIndex = dealer;
    }

    nextDealer() {  
      if (this.dealerIndex === -1 || this.dealerIndex === this.players.length - 1) {
        this.dealerIndex = 0;
      } else {
        this.dealerIndex +=1;
      }
    }
  }
  

  module.exports = PokerTable;
  