class PokerPlayer {
    constructor(name, initialChips) {
      this.name = name;
      this.chips = initialChips;
      this.hand = [];
      this.currentBet = 0;
      this.hasFolded = false;
    }
  
    receiveCard(card) {
      this.hand.push(card);
    }
  
    placeBet(amount) {  
      this.chips -= amount;
      this.currentBet += amount;
  
      return amount;
    }

    resetBet() {
      this.currentBet = 0;
    }

    fold() {
      this.hasFolded = true;
      this.resetHand();
    }

    call(betAmount) {
      const callAmount = Math.min(betAmount, this.chips);
      this.chips -= callAmount;
      this.currentBet += callAmount;
  
      return callAmount;
    }

    blind(blindAmount) {
      const newBlind = Math.min(blindAmount, this.chips);
      this.chips -= newBlind;
      this.currentBet = blindAmount;
  
      return blindAmount;
    }

    resetHand() {
      this.hand = [];
    }

    win(pot) {
      this.chips += pot;
    }

    getHand() {return this.hand;}

    getName() {return this.name;}

    getChips() {return this.chips;}

    getCurrentBet() {return this.currentBet;}

    getHasFolded() {return this.hasFolded;}

    newPlayerGame() {
      this.resetHand();
      this.hasFolded = false;
      this.resetBet();
    }


    

  
  }
  
  module.exports = PokerPlayer;