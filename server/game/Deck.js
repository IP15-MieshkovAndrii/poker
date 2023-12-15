const Card = require("./card.js");

class Deck {
    constructor() {
        this.totalCards = 52;
        this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        this.deck = this.initializeDeck();
        this.shuffle();
    }

    initializeDeck() {
        return this.ranks.flatMap(rank => this.suits.map(suit => new Card(rank, suit)));
    }

    shuffle() {
        for (let i = this.totalCards - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCard() {
        return this.deck.pop();
    }
}

module.exports = Deck;
  

  