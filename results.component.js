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
	
	this.allHands.player2Hand.fHand["winningHand"] = false;
	
	for (let _i = 0; _i < 3; _i++) { 
		this.allHands.player1Hand.fHand.cards[_i].image = this.allHands.player1Hand.fHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player2Hand.fHand.cards[_i].image = this.allHands.player2Hand.fHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player3Hand.fHand.cards[_i].image = this.allHands.player3Hand.fHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player4Hand.fHand.cards[_i].image = this.allHands.player4Hand.fHand.cards[_i].image.replace(urlToReplace, urlOfServer);		
	}
	for (let _i = 0; _i < 5; _i++) { 
		this.allHands.player1Hand.mHand.cards[_i].image = this.allHands.player1Hand.mHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player2Hand.mHand.cards[_i].image = this.allHands.player2Hand.mHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player3Hand.mHand.cards[_i].image = this.allHands.player3Hand.mHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player4Hand.mHand.cards[_i].image = this.allHands.player4Hand.mHand.cards[_i].image.replace(urlToReplace, urlOfServer);		
	}
	for (let _i = 0; _i < 5; _i++) { 
		this.allHands.player1Hand.lHand.cards[_i].image = this.allHands.player1Hand.lHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player2Hand.lHand.cards[_i].image = this.allHands.player2Hand.lHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player3Hand.lHand.cards[_i].image = this.allHands.player3Hand.lHand.cards[_i].image.replace(urlToReplace, urlOfServer);
		this.allHands.player4Hand.lHand.cards[_i].image = this.allHands.player4Hand.lHand.cards[_i].image.replace(urlToReplace, urlOfServer);		
	}	
	console.log(this.allHands);
	let arrayFirstHand = [this.allHands.player1Hand.fHand, this.allHands.player2Hand.fHand, this.allHands.player3Hand.fHand, this.allHands.player4Hand.fHand];
	this.winnerFirstHand = this.whoIsTheFirstHandWinner(arrayFirstHand);
  }

  whoIsTheFirstHandWinner(arrayFH) {
	
	//for the first hand, what is the best hand between the player ?  
	let topHandValue = -1;
	let topHandType = '';
	let arrayHandValue = arrayFH.map(f => f.handValue);
	
	topHandValue = Math.max(...arrayHandValue); 

	//for the first hand, how many players has the same hand ?  
	let potentialWinnerName = '';
	let potentialWinnerNum = [];
	let subValue = [];

	for (let _j = 0; _j < 4; _j++) {
		if (arrayFH[_j].handValue == topHandValue) {
			topHandType = arrayFH[_j].handType;
			potentialWinnerNum.push(_j + 1);  
			subValue.push(arrayFH[_j].handSubValue);
		}
	}
	
	//already a winner if there is only one player that has this hand
	if (potentialWinnerNum.length == 1) { 
		potentialWinnerName = this.allHands["player"+potentialWinnerNum[0]+"Hand"].name;
		this.allHands["player"+potentialWinnerNum[0]+"Hand"].fHand.winningHand = true;
		let winnerString = potentialWinnerName + ' wins with ' + topHandType;
		return winnerString;
	} 		

	//otherwise, we need to compare the subvalues
	let countPotentialWinner = potentialWinnerNum.length ;

	//1st subvalue : what is the best ?
	let subValue1 = subValue.map(s => s[0]);
	topSubValue1 = Math.max(...subValue1);
	if (subValue1.every(s => s == 1)) topSubValue1 = 1;
	
	//we populate potentialWinnerNumSubV1
	let potentialWinnerNumSubV1 = [];
	for (let _j = 0; _j < countPotentialWinner; _j++) { 
		if (subValue[_j][0] == topSubValue1) {			
			potentialWinnerNumSubV1.push(potentialWinnerNum[_j]);
			potentialWinner.push(compareSubValue[_j]);			
	}
	
	//if only one hand matches 1st subvalue, no need to go further  
	if (potentialWinner.length == 1)  { 
		potentialWinnerName = this.allHands["player"+potentialWinnerNum[0]+"Hand"].name;
		this.allHands["player"+potentialWinnerNum[0]+"Hand"].fHand.winningHand = true;		
		let winnerString = potentialWinnerName + ' wins with ' + topHandType;
		return winnerString;
	} 
	
	//2nd subvalue : what is the best between the potential winners?	
	let topSubValue2 = -1;
	topSubValue2 = Math.max();

	let topSubValue3 = -1;	

	//topSubValue2 = Math.max(compareSubValue[0][1],compareSubValue[1][1],compareSubValue[2][1]);
	//topSubValue3 = Math.max(compareSubValue[0][2],compareSubValue[1][2],compareSubValue[2][2]);
  }
}

