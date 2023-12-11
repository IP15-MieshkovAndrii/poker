const Card = require("./Сard.js");
const Deck = require('./Deck');
const PokerPlayer = require('./PokerPlayer');

const tenNegTwo = .01;
const tenNegFour = .0001;
const tenNegSix = .000001;
const tenNegEight = .00000001;
const tenNegTen = .0000000001;

class HandEvaluator{
    constructor(communityCards){
        this.cardsOnBoard = communityCards;
    }

    evaluateHandNumberValue(hand){
        let result = 0;
        switch (true) {
            case this.returnStraightFlushNumber(hand) !== 0:
                result = this.returnStraightFlushNumber(hand);
                break;
        
            case this.returnQuadsNumber(hand) !== 0:
                result = this.returnQuadsNumber(hand);
                break;
        
            case this.returnFullHouseNumber(hand) !== 0:
                result = this.returnFullHouseNumber(hand);
                break;
        
            case this.returnFlushNumber(hand) !== 0:
                result = this.returnFlushNumber(hand);
                break;
        
            case this.returnStraightNumber(hand) !== 0:
                result = this.returnStraightNumber(hand);
                break;
        
            case this.returnTripsNumber(hand) !== null:
                result = this.returnTripsNumber(hand);
                break;
        
            case this.returnTwoPairNumber(hand) !== null:
                result = this.returnTwoPairNumber(hand);
                break;
        
            case this.returnPairNumber(hand) !== null:
                result = this.returnPairNumber(hand);
                break;
        
            case this.returnHighCardNumber(hand) !== null:
                result = this.returnHighCardNumber(hand);
                break;
        
            default:
                result = 0;
                break;
        }
        
          return result;
    }

    returnBestHand(hands) {
        let bestHands = [];
        let bestHandNumber = 0;
      
        hands.forEach(hand => {
          const currentHandNumber = this.evaluateHandNumberValue(hand);
      
          if (currentHandNumber > bestHandNumber) {
            bestHandNumber = currentHandNumber;
            bestHands = [hand];
          } else if (currentHandNumber === bestHandNumber) {
            bestHands.push(hand);
          }
        });
      
        return bestHands.length > 0 ? bestHands : null;
    }

    evaluateHandForString(hand) {

    }

    returnHighCardNumber(hand) {
        let cards = this.returnAllSorted(hand);

        let highCard = [cards[cards.length - 1], cards[cards.length - 2], cards[cards.length - 3], cards[cards.length - 4], cards[cards.length - 5]];
    
        let highCardNumber = 0 + highCard[0].getNumber() * tenNegTwo + highCard[1].getNumber() * tenNegFour + highCard[2].getNumber() * tenNegSix + highCard[3].getNumber() * tenNegEight+ highCard[4].getNumber() * tenNegTen;
        return highCardNumber;
    }

    returnPairNumber(hand) {
        let cards = this.returnAllSorted(hand);
        let pair = false;
        let pairArr = null;
        let pairCard = 0;

        for(let i = cards.length - 2; i >= 0; i--) {
			if(cards[i+1].getNumber() === cards[i].getNumber()) {
				pair = true;
				pairCard = cards[i].getNumber();
				break;
			}
		}
        let pairNumber = 0;

        if (pair) {
            let arrCounter = 2;
			let pairArrCounter = 0;
            pairArr = [];

            for(let i = cards.length - 1; i >= 0; i--) {
				if(arrCounter <= 4 && cards[i].getNumber() != pairCard) {
					pairArr[arrCounter++] = cards[i];
				}

				if(cards[i].getNumber() == pairCard) {
					pairArr[pairArrCounter++] = cards[i];
				}
            }

            pairNumber = 1 + pairArr[0].getNumber() * tenNegTwo + pairArr[2].getNumber() * tenNegFour + pairArr[3].getNumber() * tenNegSix + pairArr[4].getNumber() * tenNegEight;
        }

        if(pairNumber !== 0) {return pairNumber;}
		return 0;
    }

    returnTwoPairNumber(hand) {
        let cards = this.returnAllSorted(hand);

        let twoPairCheck = 0;
        let twoPair11 = 0;
        let twoPair12 = 0;
        let twoPair21 = 0;
        let twoPair22 = 0;
        
        let twoPair = false;
        let TwoPair = [];
        
        for(let i = cards.length - 2; i >= 0; i--) {
            if (cards[i+1].getNumber() == cards[i].getNumber()) {
                twoPairCheck++;
                if(twoPair11 == 0) {
                    twoPair11 = i;
                    twoPair12 = i + 1;
                }
                else if(twoPair21 == 0) {
                    twoPair21 = i;
                    twoPair21 = i + 1;
                    twoPair = true;
                    break;
                }
            }
        }
        
        let twoPairNumber = 0;

        if(twoPair) {
            let highCard = new Card('s', 0);
            for(let i = cards.length - 1; i >= 0; i--) {
                if(i != twoPair11 && i != twoPair12 && i != twoPair21 && i != twoPair22) {
                    if(cards[i].getNumber() > highCard.getNumber()) {
                        highCard = cards[i];
                    }
                }
            }
            TwoPair = [cards[twoPair11], cards[twoPair12], cards[twoPair21], cards[twoPair22], highCard];	
            twoPairNumber = 2 + TwoPair[0].getNumber() * tenNegTwo + TwoPair[2].getNumber() * tenNegFour + TwoPair[4].getNumber() * tenNegSix;
        }
        
        if(twoPairNumber !== 0) {return twoPairNumber;}
        return 0;
    }

    returnTripsNumber(hand) {
        let cards = this.returnAllSorted(hand);
        let tripCheck = 0;
        let tripCard = 0;
        let hasTrips = false;
        let Trips;
        
        for(let i = cards.length - 2; i >= 0; i--) {
            if(cards[i+1].getNumber() == cards[i].getNumber()) {
                tripCheck++;

                if(tripCheck == 2) {
                    hasTrips = true;
                    tripCard = cards[i].getNumber();
                    break;
                }
            } else {
                tripCheck = 0;
            }
        }
        
        let tripsNumber = 0;

        if(hasTrips) {
            let highCard = new Card(0, 'Spades');
            let secondHighCard = new Card(0, 'Spades');;
            let newArrCounter = 0;
            Trips = [];

            for(let i = 0; i < cards.length; i++) {
                if(cards[i].getNumber() > secondHighCard.getNumber() && cards[i].getNumber() != tripCard) {
                    if(cards[i].getNumber() > highCard.getNumber()) {
                        secondHighCard = highCard;
                        highCard = cards[i];
                    } else {
                        secondHighCard = cards[i];
                    }
                }

                if(cards[i].getNumber() == tripCard) {
                    Trips[newArrCounter++] = cards[i];
                }
            }

            Trips[newArrCounter++] = highCard;
            Trips[newArrCounter] = secondHighCard;
            
            tripsNumber = 3 + Trips[0].getNumber() * tenNegTwo + Trips[3].getNumber() * tenNegFour + Trips[4].getNumber() * tenNegSix;
        }
        
        if(tripsNumber !== 0) {return tripsNumber;}
        return 0;
    }

    returnStraightNumber(hand) {
        let cards = this.returnAllSorted(hand);
        let straightCounter = 0;
        let isStraight = false;
        let wheel = false;
        let aceExists = false;
        let acePosition = 0;
        let straight = null;
        let topOfStraight = null;
        let topIndex = 0;
        
        for(let i = cards.length - 2; i >= 0; i--) {
            if (i == cards.length - 2) {
                if (cards[cards.length-1].getNumber() == 14) {
                    aceExists = true;
                    acePosition = cards.length - 1;
                }  
            }
            if (straightCounter === 4) {
                isStraight = true;
                break;
            }
            if (cards[i].getNumber() - cards[i+1].getNumber() == -1) {
                if (straightCounter == 0) {
                    topOfStraight = cards[i+1];
                    topIndex = i + 1;
                }
                straightCounter++;
            } else if(cards[i].getNumber() == cards[i+1].getNumber()) {
                //skip
            } else {
                straightCounter = 0;
            }
            if (straightCounter == 3 && cards[i].getNumber() == 2 && aceExists) {
                wheel = true;
                isStraight = true;
                break;
            }
        }
        
        if(straightCounter == 4) {
            isStraight = true;
        }
        
        let straightNumber = 0;
        if(isStraight) {
            let b = 0;
            straight = [];
            
            if (wheel) {
                b = 4;
                straight[0] = cards[acePosition];

                for(let i = topIndex; i > 0; i--) {
                    straight[b--] = cards[i];
                    if (b == 0) break;
                    if (straight[b+1].getNumber() == cards[i-1].getNumber()) i--;
                }
            } else {
            
                for(let i = topIndex; i >= 0; i--) {
                    straight[b++] = cards[i];
                    if(b == 5) break;
                    if(straight[b-1].getNumber() == cards[i-1].getNumber()) i--;
                }
            }
            straightNumber = 4 + topOfStraight.getNumber() * tenNegTwo;
        }
        
        if(straightNumber !== 0) {return straightNumber;}
        return 0;
    }

    returnFlushNumber(hand) {
        let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        let cards = this.returnAllSorted(hand);
        let flushCount= 0;
        let currentSuit;
        let isFlush = false;
        let flush = null;
        let flushNumber = 0;

        for(let i = 0; i < suits.length; i++) {
            currentSuit = suits[i];
            flushCount = 0;
            for(let k = 0; k < cards.length; k++) {
                if(cards[k].getSuit() == currentSuit) {
                    flushCount++;
                    if(flushCount == 5) {
                        isFlush = true;
                        break;
                    }
                }
            }
            if(isFlush) {
                flush = [];
                let flushArrayCounter = 0;
                for(let b = cards.length - 1; b >= 0; b--) {
                    if(cards[b].getSuit() == currentSuit) {
                        flush[flushArrayCounter++] = cards[b];
                    }
                    if(flushArrayCounter == 5) break;
                }
                flushNumber = 5 + flush[0].getNumber() * tenNegTwo + flush[1].getNumber() * tenNegFour + flush[2].getNumber() * tenNegSix + flush[3].getNumber() * tenNegEight + flush[4].getNumber() * tenNegTen;
                break;
            }
        }
        
        if(flushNumber !== 0){return flushNumber;}
        return 0;
    }

    returnFullHouseNumber(hand){
        let cards = this.returnAllSorted(hand);
        let tripCheck = 0;
        let trips = false;
        let tripNumber = 0;
        
        for(let i = cards.length - 2; i >= 0; i--) {
            if (cards[i+1].getNumber() == cards[i].getNumber()) {
                tripCheck++;
                if(tripCheck == 2) {
                    trips = true;
                    tripNumber = cards[i].getNumber();
                    break;
                }
            } else {
                tripCheck = 0;
            }
        }
        
        let House = null;
        let house = false;
        let pairNumber = 0;
        
        if (trips) {
            for(let i = cards.length - 2; i >= 0; i--) {
                if(cards[i].getNumber() != tripNumber && cards[i+1].getNumber() == cards[i].getNumber()) {
                    house = true;
                    pairNumber = cards[i].getNumber();
                }
            }
        }
        
        let fullHouseNumber = 0;
        if (house) {
            House = [];
            let tripCount = 0;
            let pairCount = 3;
            for(let i = 0; i < cards.length; i++) {
                if(cards[i].getNumber() == tripNumber) {
                    House[tripCount++] = cards[i];
                }
                if(cards[i].getNumber() == pairNumber) {
                    House[pairCount++] = cards[i];
                }
            }
            fullHouseNumber = 6 + House[0].getNumber() * tenNegTwo + House[3].getNumber() * tenNegFour;
        }
        
        if(fullHouseNumber !== 0){return fullHouseNumber;}
        return 0;
    }

    returnQuadsNumber(hand) {
        let cards = this.returnAllSorted(hand);
        let quadCount = 0;
        let hasQuads = false;
        let quadCard = 0;
        let Quads;

        for(let i = cards.length - 2; i >= 0; i--) {
            if(cards[i+1].getNumber() == cards[i].getNumber()) {
                quadCount++;
                if(quadCount == 3) {
                    hasQuads = true;
                    quadCard = cards[i].getNumber();
                    break;
                }
            } else {
                quadCount = 0;
            }
        }
        
        let quadsNumber = 0;
        
        if (hasQuads) {
            let arrCounter = 0;
            let highCard = new Card('s', 0);
            Quads = [];
            for(let i = cards.length - 1; i >= 0; i--) {
                if(cards[i].getNumber() == quadCard) {
                    Quads[arrCounter++] = cards[i];
                } else if (cards[i].getNumber() > highCard.getNumber()) {
                    highCard = cards[i];
                }
                
            }
            Quads[arrCounter] = highCard;
            quadsNumber = 7 + Quads[0].getNumber() * tenNegTwo + Quads[4].getNumber() * tenNegFour;
        }
        
        if(quadsNumber !== 0){return quadsNumber;}
        return 0;
    }

    returnStraightFlushNumber(hand) {
        let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        let cards = this.returnAllSorted(hand);
        let flush = false;
        let flushSuit;;
        let flushCount = 0;
        for(let i = 0; i < suits.length; i++) {
            let currSuit = suits[i];
            flushCount = 0;
            for(let k = 0; k < cards.length; k++) {
                if (cards[k].getSuit() == currSuit) {
                    flushCount++;
                }
            }
            if (flushCount >= 5) {
                flush = true;
                flushSuit = currSuit;
                break;
            }
        }
        
        let straight = null;
        let straightFlushNumber = 0;
        if (flush) {
            let cardsOfFlushSuit = [];
            let p = 0;
            for(let k = 0; k < cards.length; k++) {
                
                if (cards[k].getSuit() == flushSuit) {
                    cardsOfFlushSuit[p++] = cards[k];
                }
            }
            cardsOfFlushSuit = this.insertionSort(cardsOfFlushSuit);
            let straightCounter = 0;
            let isStraight = false;
            let wheel = false;
            let aceExists = false;
            let acePosition = 0;
            let topOfStraight = null;
            let topIndex = 0;

            for(let i = cardsOfFlushSuit.length - 2; i >= 0; i--) {
                if (cards[cards.length -1].getNumber() == 14) {
                    aceExists = true;
                    acePosition = cards.length -1;
                }
                if (straightCounter == 4) {
                    isStraight = true;
                    break;
                }
                if (cardsOfFlushSuit[i].getNumber() - cardsOfFlushSuit[i +1].getNumber() == -1) {
                    if (straightCounter == 0) {
                        topOfStraight = cardsOfFlushSuit[i+1];
                        topIndex = i + 1;
                    }
                    straightCounter++;
                } else if (cardsOfFlushSuit[i].getNumber() == cardsOfFlushSuit[i+1].getNumber()) {
                    //Skip 
                } else {
                    straightCounter = 0;
                }
                if (straightCounter == 3 && cards[i].getNumber() == 2 && aceExists) {
                    wheel = true;
                    isStraight = true;
                    break;
                }
            }
            if (straightCounter == 4) {
                isStraight = true;
            }
            if (isStraight) {
                straight = [];
                let b = 0;
                
                if (wheel) {
                    b = 4;
                    straight[0] = cards[acePosition];
                    for(let i = topIndex; i > 0; i--) {
                        straight[b--] = cards[i];
                        if (b == 0)break;
                        if (straight[b +1].getNumber() == cards[i -1].getNumber()) i--;
                    }
                } else {
                    for(let i = topIndex; i >= 0; i--) {
                        straight[b++] = cardsOfFlushSuit[i];
                        if (b == 5) break;
                        if(straight[b -1].getNumber() == cardsOfFlushSuit[i -1].getNumber()) i--;
                    }
                }
                straightFlushNumber = 8 + topOfStraight.getNumber() * tenNegTwo;
            }
        }
        if(straightFlushNumber !== 0) {return straightFlushNumber;}
        return 0;
    }

    currentNumCardsOnBoard() {
        return this.cardsOnBoard.length ? this.cardsOnBoard.length : 0;
    }

    insertionSort(arr) {
		for(let i = 0; i < arr.length; i++) {
			let keyCard = arr[i];
			let key = arr[i].getNumber();
			let j = i - 1;

			while(j >= 0 && arr[j].getNumber() > key) {
				arr[j+1] = arr[j];
				j = j -1;
			}

			arr[j + 1] = keyCard;
        }
        
        return arr;
	}

    returnAllSorted(hand) {
        let cards = [];
        let j = 0;
        for(let i = 0; i < this.currentNumCardsOnBoard(); i++) {
            cards[i] = this.cardsOnBoard[i];
            j++;
        }
        cards[j++] = hand[0];
        cards[j] = hand[1];
        cards = this.insertionSort(cards);
        return cards
    }



}

module.exports = HandEvaluator;