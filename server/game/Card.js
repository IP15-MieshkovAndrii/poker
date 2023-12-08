class Card {
    constructor(rank, suit) {
      this.rank = rank;
      this.suit = suit;
    }

    getSuit(){
        return this.suit;
    }

    getNumber(){
        if (this.rank === 'Jack') return 11;
        if (this.rank === 'Queen') return 12;
        if (this.rank === 'King') return 13;
        if (this.rank === 'Ace') return 14;
        return +this.rank;
    }
}

module.exports = Card;