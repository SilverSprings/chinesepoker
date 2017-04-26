import { Injectable } from '@angular/core';
@Injectable()
export class RankerService {
	// returns best hand, hand type, value
	bestHand (cards) {
		// order cards by value
		cards = cards.sort(function (a, b) { return a.v - b.v; }); 
		
		var hand, type, val;
    
		if (hand = this.isStraightFlush(cards)) {
			type = 'straight flush';
			val = 8;    
		} else if (hand = this.isXOfKind(cards, 4)) {
			type = 'four of a kind';
			val = 7;
		} else if (hand = this.isFullHouse(cards)) {
			type = 'full house';
			val = 6;
		} else if (hand = this.isFlush(cards)) {
			type = 'flush';
			val = 5;
		} else if (hand = this.isStraight(cards)) {
			type = 'straight';
			val = 4;
		} else if (hand = this.isXOfKind(cards, 3)) {
			type = 'three of a kind';
			val = 3;
		} else if (hand = this.isTwoPair(cards)) {
			type = 'two pair';
			val = 2;
		} else if (hand = this.isXOfKind(cards, 2)) {
			type = 'two of a kind';
			val = 1;
		} else {
			hand = cards.slice(-5);
			if (cards[0] == 1) hand = hand.slice(1).concat(cards[0]);
			type = 'high card';
			val = 0;
		}
    
		return {
			hand:hand,
			type:type,
			val:val
		};
	}

	/*-------------------------------------------------------------------------------------*/
	/*                                    isStraightFlush                                  */
	/*-------------------------------------------------------------------------------------*/
	isStraightFlush (cards) {
		if (cards.length < 5) return false;
		var isStraightFlush = false;
			
		// sSuit contains the spades cards, hSuit contains the hearts cards etc.
		var sSuit = cardsStraightFlush.filter( c => c.s == 's');
		var hSuit = cardsStraightFlush.filter( c => c.s == 'h');
		var cSuit = cardsStraightFlush.filter( c => c.s == 'c');
		var dSuit = cardsStraightFlush.filter( c => c.s == 'd');		

		// suits is an array : every item is a set of suited cards of at least 5 cards
		var suits = [];
		if (sSuit.length > 4) { suits.push(suit:sSuit) } 
		if (hSuit.length > 4) { suits.push(suit:hSuit) }
		if (cSuit.length > 4) { suits.push(suit:cSuit) }
		if (dSuit.length > 4) { suits.push(suit:dSuit) }	
		
		//if suits is empty, it means there is no flush, so no straight flush, no need to go futher 
		if (suits.length == 0) {return false}
		
		//straightSuit is an array : every item is a set of best straigh flush of 5 cards
		var straightSuits = [];
		for (var j=0; j < suits.length; j++) { straightSuits.push = this.isStraight(suits[j]) }

		//if straightSuit is empty, it means there is no straight flush, no need to go futher
		if (straightSuits.length == 0) {return false}
			
		//Royal straigth flush ! no need to go futher
		for (var j=0; j < straightSuits.length; j++) {
			if (straightSuits[j].suit[0].v == 1) {
					isStraightFlush = straightSuits[j];
					return isStraightFlush;
			}
		}

		//Among straightSuit, which one is the best straight flush ? 
		var topSuit = false;
		var topValue = -1;			
		for (var i=4; i > -1; i--) {
			for (var j=0; j < straightSuits.length; j++) {
				if (straightSuits[j].suit[i].v > topValue) {
					topSuit = straightSuits[j];
					topValue = suits[j].suit[i].v;
				} 				
			}
		}
		isStraightFlush = topSuit;
		return isStraightFlush;
	}

	
	/*-------------------------------------------------------------------------------------*/	
	/*                                        isFlush                                      */
	/*-------------------------------------------------------------------------------------*/
	isFlush (cards) {
		if (cards.length < 5) return false;
		var isFlush = false;
		
		//the aces have a temp value of 14, and pushed to the end of the array 
		var cardsFlush = cards.slice(0);
		for (var i = 0; i < cardsFlush.length; i++) {
			if (cardsFlush[i].v == 1) {
				cardsFlush[i].v = 14;	
				cardsFlush.push(cardsFlush[i]);
				cardsFlush.splice(i, 1);
			}
		}
		
		// sSuit contains the spades cards, hSuit contains the hearts cards etc.
		var sSuit = cardsFlush.filter( c => c.s == 's');
		var hSuit = cardsFlush.filter( c => c.s == 'h');
		var cSuit = cardsFlush.filter( c => c.s == 'c');
		var dSuit = cardsFlush.filter( c => c.s == 'd');		
		
		// suits is an array : every item is a set of suited cards of the 5 best cards
		var suits = [];
		if (sSuit.length > 4) { suits.push(suit:sSuit.slice(-5)) } 
		if (hSuit.length > 4) { suits.push(suit:hSuit.slice(-5)) }
		if (cSuit.length > 4) { suits.push(suit:cSuit.slice(-5)) }
		if (dSuit.length > 4) { suits.push(suit:dSuit.slice(-5)) }		
		
		// compare the 5 cards in each suits, if only the array suits is populated
		var topSuit = false;
		var topValue = -1;
		if (suits.length > 0) {
			for (var i = 0; i < 5; i++) {
				for (var j=0; j < suits.length; j++) {				
					if (suits[j].suit[i].v > topValue) {
						topSuit = suits[j];
						topValue = suits[j].suit[i].v;
					} 
				}
			}
			//We put back the value of 1 for the ace in the top suit	
			for (var i = 0; i < topSuit.length; i++) {
				if (topSuit[i].v == 14) {
				topSuit[i].v = 1;	
				}
			}
			topSuit.reverse();
			isFlush = topSuit;
		}
		return isFlush;
	}
	
	
	//    
	isStraight (cards) {
    if (cards.length < 5) return false;

    var cardsDesc = cards.slice(0);
    cardsDesc.reverse(); 	

    var isStraight = false;
    var length = 1;
    var bestLength = 1;
    var start = 0;
    var bestStart = 0;
   
    var i = 1;
	
    var j = 0;
	
	while (j < cardsDesc.length-1) {
		if (cardsDesc[j].v === cardsDesc[j+1].v) {cardsDesc.splice(j+1, 1)}
		j++;
	}

	var last = cardsDesc[start].v;
    while (i < cardsDesc.length && bestLength !=5 ) {	
        var current = cardsDesc[i].v;
			if (current != last - 1) {
				start = i;
				length = 1;
			} else {
				length++;
				if (length > bestLength ) {
					bestStart = start;
					bestLength = length;
				}
			}		
        last = cardsDesc[i].v;
        i++;
    }
    
    if (bestLength >= 4 && cardsDesc[0].v == 13 && cardsDesc[1].v == 12 && cardsDesc[2].v == 11 && cardsDesc[3].v == 10 && cardsDesc[cardsDesc.length-1].v == 1) {
		isStraight = cardsDesc.slice(cardsDesc.length-1,cardsDesc.length).concat(cardsDesc.slice(0,4));
    } else if (bestLength > 4) {
        isStraight = cardsDesc.slice(bestStart, bestStart+5);
    }

    return isStraight;
	}
	
}