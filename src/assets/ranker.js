//exports.bestHand = bestHand; comment

// returns best hand, hand type, value
function bestHand (cards) {
	
    // order cards by value
    cards = cards.sort(function (a, b) { return a.v - b.v; });

    var hand, type, val;

    if (hand = isStraightFlush(cards)) {
        type = 'straight flush';
        val = 8;
    } else if (hand = isXOfKind(cards, 4)) {
        type = 'four of a kind';
        val = 7;
    } else if (hand = isFullHouse(cards)) {
        type = 'full house';
        val = 6;
    } else if (hand = isFlush(cards)) {
        type = 'flush';
        val = 5;
    } else if (hand = isStraight(cards)) {
        type = 'straight';
        val = 4;
    } else if (hand = isXOfKind(cards, 3)) {
        type = 'three of a kind';
        val = 3;
    } else if (hand = isTwoPair(cards)) {
        type = 'two pair';
        val = 2;
    } else if (hand = isXOfKind(cards, 2)) {
        type = 'two of a kind';
        val = 1;
    } else {
        hand = cards.slice(-5);
        if (cards[0] == 1) hand = hand.slice(1).concat(cards[0]);
        type = 'high card';
        val = 0;
    }

    return {
        hand: hand,
        type: type,
        val: val
    };
}

function isFlush (cards) {
    if (cards.length < 5) return false;

    var isFlush = false;
    var count = { s: 0, h: 0, c: 0, d: 0 };
    for (var i = 0; i < cards.length; i++) count[cards[i].s]++;
    for (var key in count) if (count[key] > 4) {
        var suited = cards.filter(function (c) { return c.s == key; });

        if (suited[0].v == 1) suited = suited.concat(suited[0]).slice(1);
        var isFlush = suited.slice(-5);
        break;
    }

    return isFlush;
}

// suit optional
function isStraight (cards, suit) {
    if (suit) cards = cards.filter(function (card) { return card.s == suit; });
    if (cards.length < 5) return false;

    var cardsDesc = cards.slice(0);
    cardsDesc.reverse(); 	
	//console.log('cards sorted asc', cards, 'cards sorted dsc', cardsDesc);

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
	
	//console.log('double removed', JSON.stringify(cardsDesc));

	var last = cardsDesc[start].v;
	//console.log('last',	last);
    while (i < cardsDesc.length && bestLength !=5 ) {
		//console.log('start', start, 'length', length, 'i', i);		
        var current = cardsDesc[i].v;
		//console.log('current',	current);
		//console.log('last-1',	last - 1);
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
    
	//console.log('bestStart', bestStart, 'bestLength', bestLength);
    // add ace
    if (bestLength >= 4 && cardsDesc[0].v == 13 && cardsDesc[1].v == 12 && cardsDesc[2].v == 11 && cardsDesc[3].v == 10 && cardsDesc[cardsDesc.length-1].v == 1) {
		isStraight = cardsDesc.slice(cardsDesc.length-1,cardsDesc.length).concat(cardsDesc.slice(0,4));
    } else if (bestLength > 4) {
        isStraight = cardsDesc.slice(bestStart, bestStart+5);
    }

    return isStraight;
}

function isStraightFlush (cards) {
    var flush = isFlush(cards);
    return flush ? isStraight(cards, flush[0].s) : false;
}

// returns greatest possible set of x
function containsXOfKind (cards, x, filter) {
    if (filter) cards = cards.filter(filter);
    if (cards.length < x) return false;

    var xOfKind = x == 1 ? cards[0].v : false;
    var count = 1;
    var prevVal = cards[0].v;

    for (var i = 1; i < cards.length; i++) {
        if (cards[i].v == prevVal) {
            count++;
        } else {
            count = 1;
            prevVal = cards[i].v;
        }

        if (count >= x && xOfKind != cards[i].v && xOfKind != 1) xOfKind = cards[i].v;
    }

    return xOfKind;
}

function highCard (cards, filter) {
	//console.log('cards[0]', cards[0]);
    if (filter) cards = cards.filter(filter);
    if (cards.length && cards[0].v === 1) return cards[0];
    return cards.length ? cards[cards.length - 1] : null;
}

function isXOfKind (cards, x) {
    var isXOfKind = false;
    var matchX = containsXOfKind(cards, x);

    if (matchX) {
        isXOfKind = cards.filter(function (c) { return c.v == matchX; });
        var added = {};
        added[matchX] = true;

        while (isXOfKind.length < 5) {
			//console.log('added', added);
            var nextCard = highCard(cards, function (c) { return !added[c.v]; });
			//console.log('nextCard', nextCard);
            isXOfKind.unshift(nextCard);	
			if (nextCard) {	
            added[nextCard.v] = true;}
        }
    }

    return isXOfKind;
}

function isFullHouse (cards) {
    var isFullHouse = false;
    var matchThree = containsXOfKind(cards, 3);

    if (matchThree) {
        var matchTwo = containsXOfKind(cards, 2, function (c) { return c.v != matchThree; });
        
        if (matchTwo) {
            // not checking for matching four
            isFullHouse = cards.filter(function (c) { return c.v == matchTwo; }).slice(-2);
            isFullHouse = isFullHouse.concat(cards.filter(function (c) { return c.v == matchThree; }));
        }
    }

    return isFullHouse;
}

function isTwoPair (cards) {
    var isTwoPair = false
    var matchTwo = containsXOfKind(cards, 2);

    if (matchTwo) {
        var matchTwoMore = containsXOfKind(cards, 2, function (c) { return c.v != matchTwo; });

        if (matchTwoMore) {
            // not checking for matching three or more
            isTwoPair = cards.filter(function (c) { return c.v == matchTwo || c.v == matchTwoMore; });
            isTwoPair.unshift(highCard(cards, function (c) { return c.v != matchTwo && c.v != matchTwoMore; }));
        }
    }

    return isTwoPair;
}
