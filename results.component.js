import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() allHands:any;
  /* allHands=[{
				fHand:	{cards:[...],
						handType:'One Pair',
						handValue:1,
						handSubValue:1141404}				
				mHand:	{cards:[...],
						handType:'Straight',
						handValue:4,
						handSubValue:40908070605}				
				lHand:	{cards:[{image:'https...', value:'Ace', suit:'HEARTS', code:'AH'},
							   {image:'https...', value:'King', suit:'HEARTS', code:'KH'},
							   {image:'https...', value:'Queen', suit:'HEARTS', code:'QH'},
							   {image:'https...', value:'Jack', suit:'HEARTS', code:'QH'},  
							   {image:'https...', value:'10', suit:'HEARTS', code:'10H'}],
						handType:'Straight Flush',
						handValue:8,
						handSubValue:81413121110}
				num:1,
				name:'SomeName1'},
				{...},{...},{...}]
  */  
  @Output() playAgain = new EventEmitter<any>();

  
  constructor() { }
  
  arrayFirstHand = [] ;
  arrayMiddleHand = [] ;
  arrayLastHand = [] ;
  
  wFHand = {playerNum:[], handName:string};
  wMHand = {playerNum:[], handName:string};
  wLHand = {playerNum:[], handName:string};
  
  gameSummaryByHand = {fp1:boolean,fp2:boolean,fp3:boolean,fp4:boolean,
					   mp1:boolean,mp2:boolean,mp3:boolean,mp4:boolean,
					   lp1:boolean,lp2:boolean,lp3:boolean,lp4:boolean};
  pointsByPlayer = {pp1:int, pp2:int, pp3:int, pp4:int} ;
  scooper = {noScooper:boolean, name:string, playerNum:int};
   
  ngOnInit() {
	
	this.miscInit();
	
	this.wFHand = this.winnningHand(this.allHands.map(p => p.fHand));
	this.wMHand = this.winnningHand(this.allHands.map(p => p.mHand));	
	this.wLHand = this.winnningHand(this.allHands.map(p => p.lHand));
	this.gameSummary(this.wFHand, this.wMHand, this.wLHand);
  }

  miscInit () {
	var urlToReplace = 'http://deckofcardsapi.com';
	var urlOfServer = 'http://127.0.0.1:8000';
	
	for (let _p = 0; _p < 4; _i++) {
		for (let _i = 0; _i < 3; _i++) { 
			this.allHands[_p].fHand.cards[_i].image = this.allHands[_p].fHand.cards[_i].image.replace(urlToReplace, urlOfServer);	
		}
		for (let _i = 0; _i < 5; _i++) { 
			this.allHands[_p].mHand.cards[_i].image = this.allHands[_p].mHand.cards[_i].image.replace(urlToReplace, urlOfServer);
			this.allHands[_p].lHand.cards[_i].image = this.allHands[_p].lHand.cards[_i].image.replace(urlToReplace, urlOfServer);			
		}
	}
	
	this.gameSummaryByHand = {fp1:false,fp2:false,fp3:false,fp4:false,
							  mp1:false,mp2:false,mp3:false,mp4:false,
							  lp1:false,lp2:false,lp3:false,lp4:false};
	this.pointsByPlayer = {pp1:0, pp2:0, pp3:0, pp4:0} ;
	this.scooper = {noScooper:true, name:'', playerNum:99};
	this.wFHand = {playerNum:[], handName:string};
	this.wMHand = {playerNum:[], handName:string};
	this.wLHand = {playerNum:[], handName:string};
	console.log(this.allHands);  
  }
  
  
  winnningHand(arrayHandsFML) {
	
	//What is the best hand between the players ? we store that in topHandValue  
	let topHandValue = -1;
	let topHandType = '';
	//arrayHandValue contains only the hand value (from 8 to 0)
	let arrayHandValue = arrayHandsFML.map(hf => hf.handValue);
	
	topHandValue = Math.max(...arrayHandValue); 

	//for the first hand, how many players has the top Hand ?  
	let potentialWinnerNum = [];
	let potentialWinner = [];

	for (let _j = 0; _j < 4; _j++) {
		if (arrayHandsFML[_j].handValue == topHandValue) {
			topHandType = arrayHandsFML[_j].handType;
			potentialWinnerNum.push(_j + 1);  
			potentialWinner.push(arrayHandsFML[_j]);
		}
	}

	let winnerNum = [];
	//already a winner if there is only one player that matches this hand
	if (potentialWinnerNum.length == 1) { 
		winnerNum.push(potentialWinnerNum[0]);
		return {playerNum:winnerNum,handName:topHandType};
	} 		

	//otherwise, we need to compare the subvalue
	//subValue : what is the best subValue between the potential winner ? we store that in topSubValue
	let subValue = potentialWinner.map(hf => hf.handSubValue);
	let topSubValue = Math.max(...subValue);
	
	//How many potential winners match the topSubValue ? 
	for (let _j = 0; _j < potentialWinner.length; _j++) { 
		if (potentialWinner[_j].handSubValue == topSubValue) {
			winnerNum.push(potentialWinnerNum[_j]);
		}
	}
	return {playerNum:winnerNum,handName:topHandType};
  }

  gameSummary(wFHand, wMHand, wLHand) {
	let countWF = wFHand.playerNum.length;
	let countWM = wMHand.playerNum.length;
	let countWL = wLHand.playerNum.length;
	
	wFHand.playerNum.forEach( n => {
		this.gameSummaryByHand['fp'+n] = true;
		if (countWF == 1) this.pointsByPlayer['pp'+n]++; 
	});

	wMHand.playerNum.forEach( n => {
		this.gameSummaryByHand['fp'+n] = true;
		if (countWF == 1) this.pointsByPlayer['pp'+n]++; 
	});

	wLHand.playerNum.forEach( n => {
		this.gameSummaryByHand['fp'+n] = true;
		if (countWF == 1) this.pointsByPlayer['pp'+n]++; 
	});
	
	for (let _p = 1; _p < 5; _i++) {
		switch(this.pointsByPlayer['pp'+_p]) {
			case 2 : case 3 : 
				this.scooper.noScooper = false; 
				this.pointsByPlayer['pp'+_p]++; 
				this.scooper.playerNum = _p; 
				this.scooper.name = this.allHands.[_p].name;
				break;
			default : break;
		}
	}
	
  }
}

  anotherGame() {
	this.playAgain.emit(this.pointsByPlayer);
  }