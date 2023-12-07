class Card {
    constructor(rank, suit) {
      this.rank = rank;
      this.suit = suit;
    }

    getSuit(){
        return this.suit;
    }

    getRank(){
        return this.number;
    }
}

module.exports = Card;