import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Card } from '../card';

declare var bestHand:any;

//python manage.py runserver 127.0.0.1:8000

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  
  @Output() doneSorting = new EventEmitter<any>();
  
  //player hold the reference of the player's name, number, and position
  @Input() player:any;


  //hand hold the reference of all the cards dealt to the player
  @Input() handDealt:any;

  //Just the url to retrieve the blank image of a card  
  urlOfBlankCoverImg = 'http://127.0.0.1:8000/static/img/blank.png';
  
  //The reference of the blank card
  blankCard = new Card();
  
  //handPlayed hold the reference of the cards that the player has placed.  
  firstHandPlayed = {cards:[]};
  dropEnabledHandFirst:boolean;
  middleHandPlayed = {cards:[]};
  dropEnabledHandMiddle:boolean;
  lastHandPlayed = {cards:[]};  

  handFinal = {fHand:{},mHand:{},lHand:{}};
  
  //disabled the evaluate button
  disableButton = true;

  //Hide the evaluate button
  evaluateButtonHidden = false;
  
  //Converted hands
  firstHandPlayedConverted;	
  middleHandPlayedConverted;
  lastHandPlayedConverted;
  
  constructor() { }

  ngOnInit() {
	var urlToReplace = 'http://deckofcardsapi.com';
	var urlOfServer = 'http://127.0.0.1:8000';
	
	// Init of this.handDealt
	for (let _i = 0; _i < 13; _i++) { 
		this.handDealt.cards[_i].image = this.handDealt.cards[_i].image.replace(urlToReplace, urlOfServer);
		//Had the properties dropped, playedPosition, dealtPosition
		this.handDealt.cards[_i].dropped = false;
		this.handDealt.cards[_i].playedPosition = {inHand:'handDealt',position:_i};
		this.handDealt.cards[_i].dealtPosition = {inHand:'handDealt',position:_i};
		
	}
	console.log('handDealt', this.handDealt);	
  }

  checkHandFirst(i) {
	console.log ('chechHandFirst', i, this.firstHandPlayed.cards);
	//swap
	if (this.firstHandPlayed.cards.length == 4) {
		this.handDealt.cards.push(this.firstHandPlayed.cards[3]);		
		this.firstHandPlayed.cards.splice(3,1)
	}
	console.log ('chechHandFirst--', this.firstHandPlayed.cards);
  }
  
  checkHandMiddle(i) {  
	console.log ('chechHandMiddle', i, this.middleHandPlayed.cards);
	//swap
	if (this.middleHandPlayed.cards.length == 6) {
		this.handDealt.cards.push(this.middleHandPlayed.cards[5]);
		this.middleHandPlayed.cards.splice(5,1)
	}
	console.log ('chechHandMiddle--', this.middleHandPlayed.cards);
  }

  checkHandLast(i) {  
	console.log ('chechHandLast', i, this.lastHandPlayed.cards);
	//swap
	if (this.lastHandPlayed.cards.length == 6) {
		this.handDealt.cards.push(this.lastHandPlayed.cards[5]);
		this.lastHandPlayed.cards.splice(5,1)
	}
	console.log ('chechHandLast--', this.lastHandPlayed.cards);
  }
  
  ngDoCheck () {
  //console.log('in ngDoCheck');	  
  if (this.handDealt.cards.length == 0)
  { this.disableButton = false;
  } else { 
  this.disableButton = true;
  }
  }
  
  
  evaluate () {
    //evaluate firstHand
	var tempFirst;
	this.firstHandPlayedConverted = this.convertor(this.firstHandPlayed.cards);
	tempFirst = new bestHand (this.firstHandPlayedConverted);	
    this.firstHandPlayed["handtype"] = tempFirst.type; 
	this.firstHandPlayed["handValue"] = tempFirst.val;	
	console.log('this.firstHandPlayed', this.firstHandPlayed);

    //evaluate middleHand
	var tempMiddle;
	this.middleHandPlayedConverted = this.convertor(this.middleHandPlayed.cards);
	tempMiddle = new bestHand (this.middleHandPlayedConverted);	
    this.middleHandPlayed["handtype"] = tempMiddle.type; 
	this.middleHandPlayed["handValue"] = tempMiddle.val;	
	console.log('this.middleHandPlayed', this.middleHandPlayed);

    //evaluate lastHand
	var tempLast;
	this.lastHandPlayedConverted = this.convertor(this.lastHandPlayed.cards);
	tempLast = new bestHand (this.lastHandPlayedConverted);	
    this.lastHandPlayed["handtype"] = tempLast.type; 
	this.lastHandPlayed["handValue"] = tempLast.val;	
	console.log('this.lastHandPlayed', this.lastHandPlayed);
	
	//hide of the evalaute button
	this.evaluateButtonHidden = true;
	
	// emit the event with the final hand
	this.handFinal["fHand"] = this.firstHandPlayed;
	this.handFinal["mHand"] = this.middleHandPlayed;
	this.handFinal["lHand"] = this.lastHandPlayed;
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
  
  valueConvertor (value) {
	switch(value)
	{case 'ACE':return 1;
	 case 'KING':return 13;
	 case 'QUEEN':return 12;
	 case 'JACK':return 11;
	 default:return +value;
	}		
  }  
  
}
