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
    
        cardString += suit.charAt(0).toUpperCase()
        
        cardString += ".png";
        return cardString;
    }

    cardToString() {
        let cardString = "";
      
        switch (this.rank) {
            case 2:
                cardString += "Two";
                break;
            case 3:
                cardString += "Three";
                break;
            case 4:
                cardString += "Four";
                break;
            case 5:
                cardString += "Five";
                break;
            case 6:
                cardString += "Six";
                break;
            case 7:
                cardString += "Seven";
                break;
            case 8:
                cardString += "Eight";
                break;
            case 9:
                cardString += "Nine";
                break;
            case 10:
                cardString += "Ten";
                break;
            case "Jack":
                cardString += "Jack";
                break;
            case "Queen":
                cardString += "Queen";
                break;
            case "King":
                cardString += "King";
                break;
            case "Ace":
                cardString += "Ace";
                break;
        }
      
        switch (this.suit) {
            case 'Spades':
                cardString += " of Spades";
                break;
            case 'Clubs':
                cardString += " of Clubs";
                break;
            case 'Hearts':
                cardString += " of Hearts";
                break;
            case 'Diamonds':
                cardString += " of Diamonds";
                break;

            
        }
      
        return cardString;
      }
      

    static numberToString(number){
        if (number === 2) {
            return "Two";
        } else if(number === 3) {
            return "Three";
        } else if (number === 4) {
            return "Four";
        } else if (number === 5) {
            return "Five";
        } else if (number === 6) {
            return "Six";
        } else if(number === 7) {
            return "Seven";
        } else if(number === 8) {
            return "Eight";
        } else if(number === 9) {
            return "Nine";
        } else if (number === 10) {
            return "Ten";
        } else if(number === 11) {
            return "Jack";
        } else if(number === 12) {
            return "Queen";
        } else if(number === 13) {
            return "King";
        } if(number === 14) {
            return "Ace";
        }
        return 0;
      }
}

module.exports = Card;