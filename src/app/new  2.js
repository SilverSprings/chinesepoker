import { Injectable } from '@angular/core';
@Injectable()
export class RankerService {
	// returns best hand, hand type, value
	bestHand (cards) {
		// order cards by value
		cards = cards.sort(function (a, b) { return a.v - b.v; }); 
		
		var hand, type, val, subval;
    
		if (hand = this.isStraightFlush(cards)) {
			type = 'straight flush';
			val = 8;
			subval = hand[0].s;
		} else if (hand = this.isFourOfAKind(cards)) {
			type = 'four of a kind';
			val = 7;
			subval = hand[0].s;
		} else if (hand = this.isFullHouse(cards)) {
			type = 'full house';
			val = 6;
			subval = hand[0].s;
		} else if (hand = this.isFlush(cards)) {
			type = 'flush';
			val = 5;
			subval = hand[0].s;
		} else if (hand = this.isStraight(cards)) {
			type = 'straight';
			val = 4;
			subval = hand[0].s;
		} else if (hand = this.isThreeOfKind(cards)) {
			type = 'three of a kind';
			val = 3;
			subval = hand[0].s;
		} else if (hand = this.isTwoPairs(cards)) {
			type = 'two pairs';
			val = 2;
			subval = [hand[0].s, hand[2].s, hand[4].s ];
		} else if (hand = this.isOnePair(cards)) {
			type = 'two of a kind';
			val = 1;
			subval = [hand[0].s, hand[2].s, hand[3].s, hand[4].s ];
		} else {
			hand = cards.slice(-5);
			if (cards[0] == 1) hand = hand.slice(1).concat(cards[0]);
			hand.reverse();
			type = 'high card';
			val = 0;
			subval = [hand[0].s, hand[1].s, hand[2].s, hand[3].s, hand[4].s ];
		}
    
		return {
			hand:hand,
			type:type,
			val:val
		};
	}

	/*-------------------------------------------------------------------------------------*/
	/*                                        isStraightFlush                              */
	/*-------------------------------------------------------------------------------------*/
	isStraightFlush (cards) {
		if (cards.length < 5) return false;
		var isStraightFlush = false;
		var cardsStraightFlush = cards.slice(0);
		
		// sSuit contains the spades cards, hSuit contains the hearts cards etc.
		var sSuit = cardsStraightFlush.filter( c => c.s == 's');
		var hSuit = cardsStraightFlush.filter( c => c.s == 'h');
		var cSuit = cardsStraightFlush.filter( c => c.s == 'c');
		var dSuit = cardsStraightFlush.filter( c => c.s == 'd');		

		// suits is an array : every item is a set of suited cards of at least 5 cards
		var suits = [];
		if (sSuit.length > 4) suits.push({suitFlush:sSuit}); 
		if (hSuit.length > 4) suits.push({suitFlush:hSuit});
		if (cSuit.length > 4) suits.push({suitFlush:cSuit});
		if (dSuit.length > 4) suits.push({suitFlush:dSuit});	
		
		//if suits is empty, it means there is no flush, so no straight flush and no need to go futher 
		if (suits.length == 0) return false;
		
		//straightSuit is an array : every item is a set of the best straigh flush of 5 cards
		var straightSuits = [];
		for (var j=0; j < suits.length; j++) {
			var straightFlush = this.isStraight(suitFlush[j]);
			if (straightFlush) straightSuits.push(straightFlush); 
		}
		
		//if straightSuit is empty, it means there is no straight flush, no need to go futher
		if (straightSuits.length == 0) return false;
			
		//when coming back from isStraight, the cards are sorted from the best to the worst, with the ace first
		var topValue = -1;			
		for (var j=0; j < straightSuits.length; j++) {
			//check on royal straigth flush - no need to go futher if so
			if (straightSuits[j].suitFlush[0].v == 1) {
				isStraightFlush = straightSuits[j];
				return isStraightFlush;
			}
			//among straightSuit, which one is the best straight flush ? 
			else if (straightSuits[j].suitFlush[0].v > topValue) {
				isStraightFlush = straightSuits[j];
				topValue = straightSuits[j].suitFlush[i].v;
			}
		}
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
		if (sSuit.length > 4) { suits.push({suit:sSuit.slice(-5)}) } 
		if (hSuit.length > 4) { suits.push({suit:hSuit.slice(-5)}) }
		if (cSuit.length > 4) { suits.push({suit:cSuit.slice(-5)}) }
		if (dSuit.length > 4) { suits.push({suit:dSuit.slice(-5)}) }		

		//if suits is empty, it means there is no flush, so no need to go futher 
		if (suits.length == 0) return false;
		
		//compare the 5 cards in each suits
		var topSuit = false;
		for (var i=4; i > -1; i--) {
			var topValue = -1;
			var topEqual = false;
			for (var j=0; j < suits.length; j++) {				
				if (suits[j].suit[i].v = topValue) topEqual=true;
				if (suits[j].suit[i].v > topValue) {
					topValue = suits[j].suit[i].v;
					topSuit = suits[j];
					topEqual = false;
				}
			}
			if (topEqual == false) {
				isFlush = topSuit.map( c => { if (c.v == 14) { c.v = 1; return c;} else {return c} );}
				return isFlush.reverse();
			}
		}
		
		//the last case is the value of the cards of each flush are the same
		topSuit = suits[0];
		isFlush = topSuit.map( c => { if (c.v == 14) { c.v = 1; return c;} else {return c} );}
		return isFlush.reverse();
		
	}
	
	/*-------------------------------------------------------------------------------------*/	
	/*                                        isStraight                                   */
	/*-------------------------------------------------------------------------------------*/ 
	isStraight (cards) {
		if (cards.length < 5) return false;
		var isStraight = false;
		
		// the cards are reversed from the best to the worst
		var cardsDesc = cards.slice(0);
		cardsDesc.reverse(); 	

		//removal of all duplicate values
		var j = 0;
		while (j < cardsDesc.length-1) {
			if (cardsDesc[j].v === cardsDesc[j+1].v) {cardsDesc.splice(j+1, 1)}
			j++;
		}

		//if cardsDesc has less than 5 cards, there is no possible straight
		if (cardsDesc.length < 5) return false;

		//check on royal straight
		if (cardsDesc[0].v == 13 && cardsDesc[1].v == 12 && cardsDesc[2].v == 11 && cardsDesc[3].v == 10 && cardsDesc[cardsDesc.length-1].v == 1) {
			//we put the ace first
			isStraight = cardsDesc.slice(cardsDesc.length-1,cardsDesc.length).concat(cardsDesc.slice(0,4));
			return isStraight;
		}			

		//for the other cases, we need to check if there's at least 5 contiguous cards 
		var length = 1;
		var bestLength = 1;	
		var start = 0;
		var bestStart = 0;
		var i = 1;
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

	
		if (bestLength > 4) {
			isStraight = cardsDesc.slice(bestStart, bestStart+5);
			return isStraight;
		} else return false; 
	
	}

	/*-------------------------------------------------------------------------------------*/	
	/*                                        isFourOfAKind                                */
	/*-------------------------------------------------------------------------------------*/
	isFourOfAKind (cards) {
		if (cards.length < 5) return false;
		var isFourOfAKind = false;
		
		//matchFour will contain 4 cards with the same value
		//if 2 or more sets of 4 cards of the same value exist in cards, it will return the set with the best value
		//matchFour will contain false if no set of 4 cards of the same value is found 
		var matchFour = this.isXOfKind(cards, 4);
		
		//if matchFour = false, we don't go further 
		if (matchFour == false) return false;		
		
		//remainingCards contains cards minus those from matchFour 		
		var remainingCards = cards.filter ( c => c.v != matchFour[0]);  
		
		//we get the highest cards of the remaining cards
		var highCard = remainingCards.slice(-1);
		
		//we aggregate matchFour and highCard to have 5 cards
		isFourOfAKind = matchFour.concat(highCard); 
		return isFourOfAKind;
		
	}

	/*-------------------------------------------------------------------------------------*/	
	/*                                        isFullHouse                                  */
	/*-------------------------------------------------------------------------------------*/
	isFullHouse (cards) {
		if (cards.length < 5) return false;
		var isFullHouse = false;
		
		//matchThree will contain 3 cards with the same value
		//if 2 or more sets of 3 cards of the same value exist in cards, it will return the set with the best value
		//matchThree will contain false if no set of 3 cards of the same value is found 
		var matchThree = this.isXOfKind(cards, 3);

		//if matchThree = false, we don't go further 
		if (matchThree == false) return false;

		//remainingCards contains cards minus those from matchThree 		
		var remainingCards = cards.filter ( c => c.v != matchThree[0]);  

		//we get the highest pair of the remaining cards
		//if no pair is found, highPair = false
		var highPair = this.isXOfKind(remainingCards, 2);

		//if highPair = false, we can't have a full House, we don't go further 
		if (highPair == false) return false;
		
		//we aggregate matchThree and highValue to have 5 cards		
		isFullHouse = matchThree.concat(highPair); 		
		return isFullHouse;
		
	}

	/*-------------------------------------------------------------------------------------*/	
	/*                                        isThreeOfKind                                */
	/*-------------------------------------------------------------------------------------*/
	isThreeOfKind (cards) {
		if (cards.length < 5) return false;
		var isFullHouse = false;
		
		//matchThree will contain 3 cards with the same value
		//if 2 or more sets of 3 cards of the same value exist in cards, it will return the set with the best value
		//matchThree will contain false if no set of 3 cards of the same value is found 
		var matchThree = this.isXOfKind(cards, 3);

		//if matchThree = false, we don't go further 
		if (matchThree == false) return false;
		
		//remainingCards1 contains cards minus those from matchThree 		
		var remainingCards = cards.filter( c => c.v != matchThree[0]); 
		
		//twoHighCards stores the 2 highest cards from remainingCards, and put them back in desc order 
		var twoHighCards = remainingCards.slice(-2).reverse()
		
		//we aggregate matchThree and twoHighCards to have 5 cards
		isThreeOfKind = matchThree.concat(twoHighCards); 
		return isThreeOfKind; 		
	}
	
	/*-------------------------------------------------------------------------------------*/	
	/*                                        isTwoPairs                                   */
	/*-------------------------------------------------------------------------------------*/
	isTwoPairs (cards) {
		if (cards.length < 5) return false;	
		var isTwoPairs = false;
		
		//highPair1 get the highest pair of cards
		//if no pair is found, highPair1 = false
		var highPair1 = this.isXOfKind(cards, 2);
		
		//if highPair1 = false, we don't have a pair, we don't need to go further 
		if (highPair1 == false) return false;		

		//remainingCards1 contains cards minus those from highPair1 		
		var remainingCards1 = cards.filter ( c => c.v != highPair1[0]);  

		//highPair2 get the highest pair of remainingCards1
		//if no pair is found, highPair2 = false
		var highPair2 = this.isXOfKind(remainingCards1, 2);		

		//if highPair2 = false, we don't have 2 pairs, we don't need to go further 
		if (highPair2 == false) return false;			

		//remainingCards2 contains remainingCards1 minus those from highPair2 		
		var remainingCards2 = cards.filter ( c => c.v != highPair2[0]);  		

		//highCard stores the highest card in remainingCards2
		var highCard = remainingCards2.slice(-1);

		//we aggregate highPair1, highPair2 and highCard to have 5 cards
		isTwoPairs = highPair1.concat(highPair2, highCard);
		return isTwoPairs;	
	}

	/*-------------------------------------------------------------------------------------*/	
	/*                                        isOnePair                                    */
	/*-------------------------------------------------------------------------------------*/	
	isOnePair (cards) {
		if (cards.length < 3) return false;
		var isOnePair = false;
		
		//highPair stores the highest pair of cards
		//if no pair is found, highPair = false
		var highPair = this.isXOfKind(cards, 2);
		
		//if highPair = false, we don't have a pair, we don't need to go further 
		if (highPair == false) return false;			

		//remainingCards contains cards minus those from highPair		
		var remainingCards = cards.filter ( c => c.v != highPair[0]);  
		
		//threeHighCards stores the 3 highest cards from remainingCards, and put them back in desc order 
		var threeHighCards = remainingCards.slice(-3).reverse()
		
		//we aggregate highPair and threeHighCards
		isOnePair = highPair.concat(threeHighCards);
		return isOnePair; 
	}
	
	/*-------------------------------------------------------------------------------------*/	
	/*                                        isXOfKind                                    */
	/*-------------------------------------------------------------------------------------*/
	isXOfKind (cards, x) {
		if (cards.length < x) return false;
		var isXOfKind = false;
	
		//countV is an object : each property stores the number of occurence of a value 
		var countV = {v1:0, v2:0, v3:0, v4:0, v5:0, v6:0, v7:0, v8:0, v9:0, v10:0, v11:0, v12:0, v13:0}; 
		for (var i = 1; i < 14; i++) {
			cards.forEach( c => {if (c.v == i) countV["v"+i]++;} );
		}
 
		//iteration over countV : to check if x matches the number of occurence of a value
		//since we iterate over all possible values, topValue will always be equal to the greatest value
		var topValue = false;
		for (var i = 1; i < 14; i++) {
			if ( countV["v"+i] >= x ) topValue = i;
		}
		
		//Special treatment for the ace
		if (countV["v1"] >= x) topValue = i;
		
		//if there's no match, topValue remains at false, so we don't go further
		if (topValue == false) return false;

		//if there's a match, we return the x cards by filtering the cards that matches the topValue
		isXOfKind = cards.filter( c => c.v == topValue).slice(0,x);
		return isXOfKind;
	}

}