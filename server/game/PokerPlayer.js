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
      if (amount > this.chips) {
        throw new Error(`Insufficient chips. ${this.name} has ${this.chips} chips.`);
      }
  
      this.chips -= amount;
      this.currentBet += amount;
  
      return amount;
    }

    resetBet() {
      this.currentBet = 0;
    }

    fold() {
      this.hasFolded = true;
    }

    call(betAmount) {
      const callAmount = Math.min(betAmount, this.chips);
      this.chips -= callAmount;
      this.currentBet += callAmount;
  
      return callAmount;
    }

    blind(blindAmount) {
      if (blindAmount > this.chips) {
        throw new Error(`Insufficient chips. ${this.name} has ${this.chips} chips.`);
      }
  
      this.chips -= blindAmount;
      this.currentBet += blindAmount;
  
      return blindAmount;
    }

    getHand() {return this.hand;}

    getName() {return this.name.nickname;}

    getChips() {return this.chips;}

    getCurrentBet() {return this.currentBet;}

    getHasFolded() {return this.hasFolded;}


    

  }
  
  module.exports = PokerPlayer;