class PokerPlayer {
    constructor(name, initialChips) {
      this.name = name;
      this.chips = initialChips;
      this.hand = [];
    }
  
    receiveCard(card) {
      this.hand.push(card);
    }
  
    placeBet(amount) {
      this.chips -= amount;
      return amount;
    }
  }
  
  module.exports = PokerPlayer;