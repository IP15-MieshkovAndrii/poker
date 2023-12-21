const Deck = require("./Deck.js");
const HandEvaluator = require("./HandEvaluation.js");

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
      this.leftUntilEnd = this.players.length - 1;
      this.round = 1;
    }
  
    addPlayer(player) {
      this.players.push(player);
      this.leftUntilEnd = this.players.length - 1;
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

    emitPlayers() {
      let returnArr = [];
      let dealerIndex = this.dealerIndex;
      let pot = this.potSize;
      returnArr.push(dealerIndex, pot);
      let currPerson;
      for(let i = 0; i < this.getPlayers().length; i++) {
          currPerson = this.players[i];
          let holeCard1;
          let holeCard2;
          if(currPerson.getHand()[0] == null){
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
            isTurn: (this.currentPlayer === i),
            isFold: currPerson.getHasFolded(),
          });
      }
      return  returnArr;
    }
  
    evaluateRound() {
      const evaluation = new HandEvaluator(this.communityCards);
      let playerHands = this.getPlayersHands();
      // console.log('playerHands', playerHands)
      const bestHands = evaluation.returnBestHand(playerHands);
      console.log('bestHands', bestHands)
      const bestPlayers = [];

      for (let i = 0; i < this.players.length; i++) {
        if (bestHands.includes(playerHands[i])) {
          const message = 'WIN \r\n' + evaluation.evaluateHandForString(playerHands[i]);
          const playerName = this.players[i].getName();
          bestPlayers.push({name: playerName, message});
        }
      }
    
      return bestPlayers;
    }

    setDealer(dealer) {
      this.dealerIndex = dealer;
    }

    getDealer() {
      return this.dealerIndex;
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

    nextPlayer(i = this.currentPlayer) {
      let nextIndex = i;

      do {
        if (nextIndex === -1 || nextIndex === this.players.length - 1) {
          nextIndex = 0;
        } else {
          nextIndex++;
        }
      } while (this.players[nextIndex].getHasFolded());
    
      this.currentPlayer = nextIndex;
      return nextIndex;
    }

    getCurrentPlayer() {
      return this.currentPlayer;
    }

    getLeftUntilEnd() {
      return this.leftUntilEnd;
    }

    setLeftUntilEnd(i) {
      this.leftUntilEnd = i;
    }
    oneMoreLeft() {
      this.leftUntilEnd -= 1;
      return this.leftUntilEnd;
    }

    getRound() {
      return this.round;
    }

    setRound(i) {
      this.round = i;
    }

    setCommunityCards(number) {
      for (let i = 0; i < number; i++) {
        const card = this.deck.dealCard();
        this.communityCards.push(card)
      }
    }

    resetCommunityCards() {
      this.communityCards = []
    }

    getCommunityCards() {
      let cards = [];

      if(this.communityCards.length > 0) {
        for (const card of this.communityCards) {
          cards.push(card.cardToPNG())
        }
      }

      return cards;
    }

    getPlayersHands() {
      const playerHands = [];
      let players = this.players.filter(player => !player.getHasFolded())

      for (const player of players) {
        playerHands.push(player.getHand());
      }

      return playerHands;
    }

    newGame() {
      this.resetCommunityCards();
      this.deck = new Deck();
      this.setRound(1);
      this.setLeftUntilEnd(this.players.length - 1);

      let oldDealer = this.players[this.dealerIndex].getName();

      this.players = this.players.filter(player => player.getChips() !== 0);
      for (const player of this.players) {
        player.newPlayerGame();
      }

      const oldDealerIsStillPlayer = this.players.findIndex(player => player.getName() === oldDealer)
      if (oldDealerIsStillPlayer) {
        this.dealerIndex = oldDealerIsStillPlayer;
        this.nextDealer();
      }

    }
  }
  

  module.exports = PokerTable;
  