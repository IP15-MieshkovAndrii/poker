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

    cardToPNG() {
        let number = this.getNumber();
        let suit = this.suit;
        let cardString = "" + number;
    
    
        if (suit == 'Spades') {
            cardString += "S";
        }
        if (suit == 'Clubs') {
            cardString += "C";
        }
        if (suit == 'Hearts') {
            cardString += "H";
        }
        if (suit == 'Diamonds') {
            cardString += "D";
        }
        
        cardString += ".png";
        return cardString;
    }

    cardToString() {
        let cardString = "";
        if (this.rank == 2) {
            cardString += "Two";
        } else if (this.rank == 3) {
            cardString += "Three";
        } else if (this.rank == 4) {
            cardString += "Four";
        } else if (this.rank == 5) {
            cardString += "Five";
        } else if (this.rank == 6) {
            cardString += "Six";
        } else if (this.rank == 7) {
            cardString += "Seven";
        } else if (this.rank == 8) {
            cardString += "Eight";
        } else if (this.rank == 9) {
            cardString += "Nine";
        } else if (this.rank == 10) {
            cardString += "Ten";
        } else if (this.rank == "Jack") {
            cardString += "Jack";
        } else if (this.rank == "Queen") {
            cardString += "Queen";
        } else if (this.rank == "King") {
            cardString += "King";
        } else if (this.rank == "Ace") {
            cardString += "Ace";
        }
        
        if(this.suit == 's') {
            cardString += " of Spades";
        } else if (this.suit == 'c'){
            cardString += " of Clubs";
        } else if (this.suit == 'h') {
            cardString += " of Hearts";
        } else if (this.suit == 'd') {
            cardString += " of Diamonds";
        }

        return cardString;
    }

    static numberToString(number){
        if (number == 2) {
            return "Two";
        } else if(number == 3) {
            return "Three";
        } else if (number == 4) {
            return "Four";
        } else if (number == 5) {
            return "Five";
        } else if (number == 6) {
            return "Six";
        } else if(number == 7) {
            return "Seven";
        } else if(number == 8) {
            return "Eight";
        } else if(number == 9) {
            return "Nine";
        } else if (number == 10) {
            return "Ten";
        } else if(number == 11) {
            return "Jack";
        } else if(number == 12) {
            return "Queen";
        } else if(number == 13) {
            return "King";
        } if(number == 14) {
            return "Ace";
        }
        return 0;
      }
}

module.exports = Card;