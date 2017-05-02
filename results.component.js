import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() allHands:any;
  constructor() { }
  
  winnerFirstHand:string;
  winnerMiddleHand:string;
  winnerLastHand:string;
  
  ngOnInit() {
	var urlToReplace = 'http://deckofcardsapi.com';
	var urlOfServer = 'http://127.0.0.1:8000';
	
	for (let _p = 1; _p < 5; _i++) {
		this.allHands["player"+_p+"Hand"].fHand["winningHand"] = false;
		this.allHands["player"+_p+"Hand"].mHand["winningHand"] = false;
		this.allHands["player"+_p+"Hand"].lHand["winningHand"] = false;
		for (let _i = 0; _i < 3; _i++) { 
			this.allHands["player"+_p+"Hand"].fHand.cards[_i].image = this.allHands["player"+_p+"Hand"].fHand.cards[_i].image.replace(urlToReplace, urlOfServer);	
		}
		for (let _i = 0; _i < 5; _i++) { 
			this.allHands["player"+_p+"Hand"].mHand.cards[_i].image = this.allHands["player"+_p+"Hand"].mHand.cards[_i].image.replace(urlToReplace, urlOfServer);
			this.allHands["player"+_p+"Hand"].lHand.cards[_i].image = this.allHands["player"+_p+"Hand"].lHand.cards[_i].image.replace(urlToReplace, urlOfServer);			
		}
	}
	
	console.log(this.allHands);
	
	let arrayFirstHand = [this.allHands.player1Hand.fHand, this.allHands.player2Hand.fHand, this.allHands.player3Hand.fHand, this.allHands.player4Hand.fHand];
	this.winnerFirstHand = this.whoHasTheWinnningHand(arrayFirstHand, 'f');
	let arrayMiddleHand = [this.allHands.player1Hand.mHand, this.allHands.player2Hand.mHand, this.allHands.player3Hand.mHand, this.allHands.player4Hand.mHand];
	this.winnerMiddleHand = this.whoHasTheWinnningHand(arrayMiddleHand, 'm');
	let arrayLastHand = [this.allHands.player1Hand.lHand, this.allHands.player2Hand.lHand, this.allHands.player3Hand.lHand, this.allHands.player4Hand.lHand];	
	this.winnerLastHand = this.whoHasTheWinnningHand(arrayLastHand, 'l');
  }

  whoHasTheWinnningHand(arrayFH, fml) {
	
	//What is the best hand between the players ? we store that in topHandValue  
	let topHandValue = -1;
	let topHandType = '';
	//arrayHandValue contains only the hand value (from 8 to 0)
	let arrayHandValue = arrayFH.map(hf => hf.handValue);
	
	topHandValue = Math.max(...arrayHandValue); 

	//for the first hand, how many players has the same hand ?  
	let winnerName = '';
	let potentialWinnerNum = [];
	let potentialWinner = [];

	for (let _j = 0; _j < 4; _j++) {
		if (arrayFH[_j].handValue == topHandValue) {
			topHandType = arrayFH[_j].handType;
			potentialWinnerNum.push(_j + 1);  
			potentialWinner.push(arrayFH[_j]);
		}
	}

	let countPotentialWinner = potentialWinnerNum.length ;
	
	//already a winner if there is only one player that matches this hand
	if (countPotentialWinner == 1) { 
		winnerName = this.allHands["player"+potentialWinnerNum[0]+"Hand"].name;
		this.allHands["player"+potentialWinnerNum[0]+"Hand"][fml + "Hand"].winningHand = true;
		let winnerString = winnerName + ' wins with ' + topHandType;
		return winnerString;
	} 		

	//otherwise, we need to compare the subvalue
	//subValue : what is the best subValue between the potential winner ? we store that in topSubValue
	let subValue = potentialWinner.map(hf => hf.handSubValue);
	let topSubValue = Math.max(...subValue);
	
	//How many potential winners match the topSubValue ? 
	let winnerCount = 0;
	for (let _j = 0; _j < countPotentialWinner; _j++) { 
		if (potentialWinner[_j].handSubValue == topSubValue) {
			if (winnerCount != 0) winnerName += ' and';
			winnerCount++;
			winnerName += this.allHands["player"+potentialWinnerNum[_j]+"Hand"].name;
			this.allHands["player"+potentialWinnerNum[_j]+"Hand"][fml + "Hand"].winningHand = true;		
		}
	}
	
	//if only one hand matches topSubValue, there is only one winner
	if (winnerCount == 1)  {
		let winnerString = winnerName + ' wins with ' + topHandType;
		return winnerString;
	//else, there is a draw
	} else {
		let winnerString = winnerName + ' win with ' + topHandType;
		return winnerString;
	}
  }
}

