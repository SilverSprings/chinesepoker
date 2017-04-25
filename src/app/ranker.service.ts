import { Injectable } from '@angular/core';
@Injectable()
export class RankerService {
// returns best hand, hand type, value
  bestHand (cards) {
    // order cards by value
    cards = cards.sort(function (a, b) { return a.v - b.v; }); 
    var hand, typeHand, valHand;
    
    if (hand = isStraightFlush(cards)) {
        typeHand = 'straight flush';
        valHand = 8;    
    } else if (hand = isXOfKind(cards, 4)) {
        typeHand = 'four of a kind';
        valHand = 7;
    } else if (hand = isFullHouse(cards)) {
        typeHand = 'full house';
        valHand = 6;
    } else if (hand = isFlush(cards)) {
        typeHand = 'flush';
        valHand = 5;
    } else if (hand = isStraight(cards)) {
        typeHand = 'straight';
        valHand = 4;
    } else if (hand = isXOfKind(cards, 3)) {
        typeHand = 'three of a kind';
        valHand = 3;
    } else if (hand = isTwoPair(cards)) {
        typeHand = 'two pair';
        valHand = 2;
    } else if (hand = isXOfKind(cards, 2)) {
        typeHand = 'two of a kind';
        valHand = 1;
    } else {
        hand = cards.slice(-5);
        if (cards[0] == 1) hand = hand.slice(1).concat(cards[0]);
        typeHand = 'high card';
        valHand = 0;
    }
    
    return {
      hand:hand,
      typeHand:typeHand,
      valHand:valHand
    };
  }
    
}
