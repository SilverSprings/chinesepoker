import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

declare var bestHand:any;

//import { bestHand } from '/node_modules/hand-ranker'

@Component({
  selector: 'app-other-player',
  templateUrl: './other-player.component.html',
  styleUrls: ['./other-player.component.css']
})
export class OtherPlayerComponent implements OnInit {
  @Input() hand:any;
  @Input() player:any;
  @Output() doneSorting = new EventEmitter<any>();
  
  urlOfCoverStackImg:string;
  
  constructor() { }
  
 
  cards2 =  
[{s:'s',v:11},
{s:'d',v:11},
{s:'c',v:13},
{s:'d',v:13},
{s:'h',v:12},
{s:'c',v:12},
{s:'s',v:5},
{s:'h',v:3},
{s:'d',v:3},
{s:'s',v:4},
{s:'s',v:8},
{s:'c',v:5},
{s:'c',v:4}];/*
  console.log ('', this.cards2);
  var temp2 = this.cards2.slice(0);
  temp2.sort(function (a, b) { return a.v - b.v; });
  temp2.reverse();
  this.temp = new bestHand(this.cards2);
  console.log ('temp', this.temp); 
  temp;
*/

  cardsConverted = [];
  remainingCardsConverted = [];
  lastHand;
  middleHand;
  firstHand;

  lastHandFinal = {cards:[]};
  middleHandFinal = {cards:[]};
  firstHandFinal = {cards:[]};
  handFinal = {fHand:{},mHand:{},lHand:{}};
  
  ngOnInit() {
  
  if (this.player.num==3) {
	this.urlOfCoverStackImg = 'http://127.0.0.1:8000/static/img/coverbluestacklayed.png';  
  } else {	  
	this.urlOfCoverStackImg = 'http://127.0.0.1:8000/static/img/coverbluestack.png';
  }
  
  console.log('Computer', this.hand);
  // Converting the dealt hand
  this.cardsConverted = this.convertor(this.hand.cards);
  //this.cardsConverted = this.cards2;
  console.log('converted', this.cardsConverted);
  
  // Looking for the best hand with the 13 cards to get the last hand
  this.lastHand = new bestHand(this.cardsConverted);
  console.log('lastHand', this.lastHand);
  
  // Removing the cards already used
  this.remainingCardsConverted = this.cardsConverted.filter(item => this.lastHand.hand.indexOf(item) === -1); 
  console.log('Remain', this.remainingCardsConverted);

  // Looking for the best hand with the 8 cards to get the middle hand
  this.middleHand = new bestHand(this.remainingCardsConverted);  
  console.log('middleHand', this.middleHand); 
  
  // The last 3 cards are for the firstHand
  this.firstHand = new bestHand(this.remainingCardsConverted.filter(item => this.middleHand.hand.indexOf(item) === -1));
  console.log('firstHand', this.firstHand);
  
  // Get Back the last Hand with all properties for each card
  this.lastHandFinal.cards = this.backConvertor(this.lastHand.hand);
  this.lastHandFinal["handType"] = this.lastHand.type;   
  this.lastHandFinal["handValue"] = this.lastHand.val;     
  console.log(this.lastHandFinal); 
  
  // Get Back the middle Hand with all properties for each card
  this.middleHandFinal.cards = this.backConvertor(this.middleHand.hand);
  this.middleHandFinal["handType"] = this.middleHand.type;   
  this.middleHandFinal["handValue"] = this.middleHand.val;     
  console.log(this.middleHandFinal); 
  
  // Get Back the first Hand with all properties for each card
  if (this.firstHand.hand.length === 3) {
  this.firstHandFinal.cards = this.backConvertor(this.firstHand.hand);
  } else {
  this.firstHandFinal.cards = this.backConvertor(this.firstHand.hand.slice(2,5));  
  }
  this.firstHandFinal["handType"] = this.firstHand.type;   
  this.firstHandFinal["handValue"] = this.firstHand.val;     
  console.log(this.firstHandFinal);   

  // emit the event with the final hand
  this.handFinal["fHand"] = this.firstHandFinal;
  this.handFinal["mHand"] = this.middleHandFinal;
  this.handFinal["lHand"] = this.lastHandFinal;
  this.doneSorting.emit(this.handFinal);
  }
  
  convertor (handToConvert) {  
   var tempCardconverted = handToConvert.map((e) => {
	   var tempCard = {s:'', v:0};
	   tempCard.s = this.suitConvertor(e.suit);
	   tempCard.v = this.valueConvertor(e.value);
	   return tempCard});
   return tempCardconverted;
  }
  
  suitConvertor (suit) {
	switch(suit)
	{case 'SPADES':return 's';
	 case 'HEARTS':return 'h';
	 case 'CLUBS':return 'c';
	 case 'DIAMONDS':return 'd';
	}		
  }

  suitConvertorBack (suit) {
	switch(suit)
	{case 's':return 'SPADES';
	 case 'h':return 'HEARTS' ;
	 case 'c':return 'CLUBS';
	 case 'd':return 'DIAMONDS';
	}		
  }
  
  valueConvertor (value) {
	switch(value)
	{case 'ACE':return 1;
	 case 'KING':return 13;
	 case 'QUEEN':return 12;
	 case 'JACK':return 11;
	 default:return +value;
	}		
  }

  valueConvertorBack (value) {
	switch(value)
	{case 1:return 'ACE' ;
	 case 13:return 'KING';
	 case 12:return 'QUEEN';
	 case 11:return 'JACK';
	 default:return value.toString();
	}
  }
  
  backConvertor (handToConvertBack) {
	var tempCardconverted = handToConvertBack.map((e) => {
		var tempCardBack = {suit:'', value:'0'};
		tempCardBack.suit = this.suitConvertorBack(e.s);
		tempCardBack.value = this.valueConvertorBack(e.v);
		return tempCardBack});
	
	var backToNormal = [];
	for (let k=0; k < tempCardconverted.length; k++) {
		for (let l=0; l < this.hand.cards.length; l++) {
			if (tempCardconverted[k].suit === this.hand.cards[l].suit && tempCardconverted[k].value === this.hand.cards[l].value) {
				backToNormal = backToNormal.concat(this.hand.cards[l]);
			}
		}
	}
	return backToNormal;
	}
	
	
	//= this.hand.cards.filter(item => this.middleHand.hand.indexOf(item) !== -1
}
